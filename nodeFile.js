const axios = require('axios');
const cheerio = require('cheerio');

async function getBrilworksJobDetailsCheerio() {
    const url = "https://brilworks.com/career/";
    const jobDetails = [];

    try {
        console.log(`Fetching HTML from: ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000 // 15 seconds timeout for the request
        });

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);

        console.log("HTML loaded into Cheerio. Searching for job cards...");

        // Find all job cards using the same CSS selector as before
        const jobCards = $('div.card.job-card');

        if (jobCards.length === 0) {
            console.warn("No job cards found using the selector 'div.card.job-card'. The website might be using JavaScript to load content, or the selector is incorrect.");
            // You could try alternative selectors here if you have them from inspection
            // For example:
            // jobCards = $('div.col-sm-6.mb-20 .card');
            // if (jobCards.length === 0) {
            //     console.warn("No job cards found with alternative selectors either.");
            // }
             // If no specific cards found, check if a main container exists as a hint
             const mainContainer = $('div.col-sm-6.mb-20');
             if (mainContainer.length > 0) {
                 console.log("Found parent container 'div.col-sm-6.mb-20', but no specific job cards within it. This often indicates dynamic loading.");
             }
             return []; // No jobs found statically
        }

        jobCards.each((index, element) => {
            const card = $(element); // Wrap the element in Cheerio for easy traversal

            let jobTitle = 'N/A';
            let jobExperience = 'N/A';

            try {
                // Extract Job Title
                // Similar to jQuery: find within the current card element
                const titleElement = card.find('div.col-md-9 span.job-developer');
                if (titleElement.length > 0) { // Cheerio returns an empty object if not found
                    jobTitle = titleElement.text().trim();
                }
            } catch (e) {
                // console.error("Error extracting title from card:", e);
            }

            try {
                // Extract Experience - First attempt: specific span with "Years" pattern
                const experienceRangeElement = card.find('div.d-flex.align-items-center.flex-wrap span.font-large.text-capitalize.text-nowrap.text-truncate-1');
                if (experienceRangeElement.length > 0) {
                    jobExperience = experienceRangeElement.text().trim();
                } else {
                    // Fallback: general regex search within the card's text
                    const cardText = card.text(); // Get all text within the card
                    const yearsMatch = cardText.match(/\d+\s*to\s*\d+\s*Years|\d+\s*Years|\d+\s*Year/i);
                    if (yearsMatch) {
                        jobExperience = yearsMatch[0].trim();
                    } else {
                        // Another fallback: check for "Days" or "Full Time" if no years found
                        const daysTimeMatch = cardText.match(/(\d+\s*Days|Full Time|Part Time)/i);
                        if (daysTimeMatch) {
                            jobExperience = daysTimeMatch[0].trim();
                        }
                    }
                }
            } catch (e) {
                // console.error("Error extracting experience from card:", e);
            }

            jobDetails.push({
                title: jobTitle,
                experience: jobExperience
            });
        });

    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        if (axios.isAxiosError(error)) {
            console.error(`Axios specific error: ${error.code || 'N/A'}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data: ${error.response.data}`);
            }
        }
    }
    return jobDetails;
}

// Run the scraper
(async () => {
    console.log("Fetching job details from Brilworks careers page using Cheerio...");
    const jobs = await getBrilworksJobDetailsCheerio();

    if (jobs.length > 0) {
        console.log("\n--- Found Job Openings ---");
        jobs.forEach(job => {
            console.log(`Job Title: ${job.title}, Experience: ${job.experience}`);
        });
    } else {
        console.log("No job details found or an error occurred. This often means the content is loaded dynamically by JavaScript and Cheerio cannot see it.");
    }
})();