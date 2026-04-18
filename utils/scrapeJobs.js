// utils/scrapeJobs.js
const puppeteer = require("puppeteer");

const scrapeCareerPage = async (websiteUrl) => {
  let browser;
  try {
    // Try common career page URLs
    const careerPaths = [
      "/career", "/careers", "/jobs", "/join-us",
      "/work-with-us", "/hiring", "/opportunities"
    ];

    const baseUrl = new URL(websiteUrl).origin;
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    );

    let careerUrl = null;
    let pageContent = "";

    // Try each career path
    for (const path of careerPaths) {
      try {
        const tryUrl = baseUrl + path;
        const response = await page.goto(tryUrl, {
          waitUntil: "networkidle2",
          timeout: 10000,
        });

        if (response && response.status() === 200) {
          careerUrl = tryUrl;
          break;
        }
      } catch {
        continue;
      }
    }

    // If no career path found, try the main website
    if (!careerUrl) {
      await page.goto(websiteUrl, {
        waitUntil: "networkidle2",
        timeout: 10000,
      });
    }

    // Wait a bit for dynamic content
    await new Promise((r) => setTimeout(r, 2000));

    // Extract all visible text content
    pageContent = await page.evaluate(() => {
      // Remove scripts, styles, nav, footer
      const remove = document.querySelectorAll(
        "script, style, nav, footer, header"
      );
      remove.forEach((el) => el.remove());
      return document.body.innerText;
    });

    return {
      url: careerUrl || websiteUrl,
      content: pageContent.slice(0, 8000), // limit tokens
    };
  } catch (error) {
    throw new Error("Failed to scrape: " + error.message);
  } finally {
    if (browser) await browser.close();
  }
};
module.exports = { scrapeCareerPage };
// // utils/scrapeJobs.js
// import puppeteer from "puppeteer";

// export const scrapeCareerPage = async (websiteUrl) => {
//   let browser;
//   try {
//     // Try common career page URLs
//     const careerPaths = [
//       "/career", "/careers", "/jobs", "/join-us",
//       "/work-with-us", "/hiring", "/opportunities"
//     ];

//     const baseUrl = new URL(websiteUrl).origin;
//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
//     );

//     let careerUrl = null;
//     let pageContent = "";

//     // Try each career path
//     for (const path of careerPaths) {
//       try {
//         const tryUrl = baseUrl + path;
//         const response = await page.goto(tryUrl, {
//           waitUntil: "networkidle2",
//           timeout: 10000,
//         });

//         if (response && response.status() === 200) {
//           careerUrl = tryUrl;
//           break;
//         }
//       } catch {
//         continue;
//       }
//     }

//     // If no career path found, try the main website
//     if (!careerUrl) {
//       await page.goto(websiteUrl, {
//         waitUntil: "networkidle2",
//         timeout: 10000,
//       });
//     }

//     // Wait a bit for dynamic content
//     await new Promise((r) => setTimeout(r, 2000));

//     // Extract all visible text content
//     pageContent = await page.evaluate(() => {
//       // Remove scripts, styles, nav, footer
//       const remove = document.querySelectorAll(
//         "script, style, nav, footer, header"
//       );
//       remove.forEach((el) => el.remove());
//       return document.body.innerText;
//     });

//     return {
//       url: careerUrl || websiteUrl,
//       content: pageContent.slice(0, 8000), // limit tokens
//     };
//   } catch (error) {
//     throw new Error("Failed to scrape: " + error.message);
//   } finally {
//     if (browser) await browser.close();
//   }
// };