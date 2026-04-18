const express = require("express");
const { scrapeCareerPage } = require("../utils/scrapeJobs.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Company = require("../models/Company.js");
const ScrapedJobCache = require("../models/ScrapedJob.js");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/company/:id/jobs", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    console.log("Company:", company.name, "| Website:", company.website);

    // ✅ Check cache first
    const cached = await ScrapedJobCache.findOne({
      company: company._id,
      expiresAt: { $gt: new Date() },
    });

    if (cached) {
      console.log("✅ Returning cached jobs for", company.name);
      return res.json({
        company: { name: company.name, website: company.website },
        careerUrl: cached.careerUrl,
        jobs: cached.jobs,
        scrapedAt: cached.scrapedAt,
        fromCache: true,
      });
    }

    // 🔍 No cache — scrape fresh
    console.log("🔍 Scraping fresh jobs for", company.name);
    const scraped = await scrapeCareerPage(company.website);
    console.log("Scraped URL:", scraped.url);
    console.log("Content length:", scraped.content.length, "chars");

    // 🤖 Use Gemini to extract jobs
    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a job listing extractor. From the following career page content, extract all job openings.

Return ONLY a valid JSON array (no markdown, no explanation, no backticks) in this exact format:
[
  {
    "title": "Job Title",
    "department": "Department or null",
    "location": "Location or Ahmedabad",
    "type": "Full-time",
    "experience": "Experience required or null",
    "description": "Brief 2-3 line description of the role",
    "skills": ["skill1", "skill2"],
    "applyUrl": "Direct apply URL if found or null"
  }
]

If no jobs are found on the page, return an empty array: []

Career page URL: ${scraped.url}
Career page content:
${scraped.content}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    console.log("Gemini response (first 300 chars):", rawText.slice(0, 300));

    let jobs = [];
    try {
      // Remove markdown code fences if Gemini adds them
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      jobs = JSON.parse(cleaned);
    } catch {
      // Try to extract JSON array from anywhere in the response
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          jobs = JSON.parse(match[0]);
        } catch (e) {
          console.error("Failed to parse jobs JSON:", e.message);
          jobs = [];
        }
      }
    }

    console.log(`✅ Extracted ${jobs.length} jobs for ${company.name}`);

    // 💾 Save to cache (upsert)
    await ScrapedJobCache.findOneAndUpdate(
      { company: company._id },
      {
        company: company._id,
        careerUrl: scraped.url,
        jobs,
        scrapedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hr cache
      },
      { upsert: true, new: true }
    );

    res.json({
      company: { name: company.name, website: company.website },
      careerUrl: scraped.url,
      jobs,
      scrapedAt: new Date(),
      fromCache: false,
    });

  } catch (error) {
    console.error("Error in /company/:id/jobs:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// ====================================================
//                Claude Console
// ====================================================
// const express = require("express");
// const { scrapeCareerPage } = require("../utils/scrapeJobs.js");
// const Anthropic = require("@anthropic-ai/sdk").default;
// const Company = require("../models/Company.js");
// const ScrapedJobCache = require("../models/ScrapedJob.js");

// const router = express.Router();
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// router.get("/company/:id/jobs", async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) return res.status(404).json({ message: "Company not found" });

//     console.log("Company:", company.name, "| Website:", company.website);

//     // Check cache first
//     const cached = await ScrapedJobCache.findOne({
//       company: company._id,
//       expiresAt: { $gt: new Date() },
//     });

//     if (cached) {
//       console.log("Returning cached jobs for", company.name);
//       return res.json({
//         company: { name: company.name, website: company.website },
//         careerUrl: cached.careerUrl,
//         jobs: cached.jobs,
//         scrapedAt: cached.scrapedAt,
//         fromCache: true,
//       });
//     }

//     // No cache - scrape fresh
//     console.log("Scraping fresh jobs for", company.name);
//     const scraped = await scrapeCareerPage(company.website);
//     console.log("Scraped URL:", scraped.url);
//     console.log("Content length:", scraped.content.length, "chars");

//     const message = await anthropic.messages.create({
//       model: "claude-sonnet-4-20250514",
//       max_tokens: 2000,
//       messages: [
//         {
//           role: "user",
//           content: `You are a job listing extractor. From the following career page content, extract all job openings.

// Return ONLY a valid JSON array (no markdown, no explanation, no backticks) like this:
// [
//   {
//     "title": "Job Title",
//     "department": "Department or null",
//     "location": "Location or Ahmedabad",
//     "type": "Full-time",
//     "experience": "Experience required or null",
//     "description": "Brief 2-3 line description",
//     "skills": ["skill1", "skill2"],
//     "applyUrl": "Direct apply URL or null"
//   }
// ]

// If no jobs found, return [].
// Career page URL: ${scraped.url}
// Content:
// ${scraped.content}`,
//         },
//       ],
//     });

//     const rawText = message.content[0].text.trim();
//     console.log("Claude response (first 300 chars):", rawText.slice(0, 300));

//     let jobs = [];
//     try {
//       jobs = JSON.parse(rawText);
//     } catch {
//       const match = rawText.match(/\[[\s\S]*\]/);
//       if (match) {
//         try {
//           jobs = JSON.parse(match[0]);
//         } catch (e) {
//           console.error("Failed to parse jobs JSON:", e.message);
//         }
//       }
//     }

//     console.log("Extracted", jobs.length, "jobs");

//     // Save to cache
//     await ScrapedJobCache.findOneAndUpdate(
//       { company: company._id },
//       {
//         company: company._id,
//         careerUrl: scraped.url,
//         jobs,
//         scrapedAt: new Date(),
//         expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       },
//       { upsert: true, new: true }
//     );

//     res.json({
//       company: { name: company.name, website: company.website },
//       careerUrl: scraped.url,
//       jobs,
//       scrapedAt: new Date(),
//       fromCache: false,
//     });

//   } catch (error) {
//     console.error("Error in /company/:id/jobs:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;