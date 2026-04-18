const puppeteer = require('puppeteer');

async function getExcelssiorJobDetails() {
    const url = "https://excelssiortechnologies.com/career";
    const jobDetails = [];
    let browser;

    try {
        // Launch a browser instance (non-headless for easy debugging initially)
        browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // <--- IMPORTANT: Update this path!
                headless: false, // Set to 'new' or true for headless production run
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars', // Hides "Chrome is being controlled by automated test software"
                '--window-size=1200,800' // Set a reasonable window size
            ],
            defaultViewport: null // Allows browser to use default window size
        });
        const page = await browser.newPage();

        // Set a user agent to mimic a real browser for better stealth
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        console.log(`Navigating to ${url}...`);

        // Navigate to the URL and wait for the network to be idle,
        // which often means all main resources (including dynamic ones) have loaded.
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }); // Increased timeout to 60 seconds

        console.log(`Successfully navigated to ${url}.`);

        // --- Robust Waiting Strategy ---
        // Wait for the main container of the job listings.
        // Based on the screenshot, a good candidate for the main job card container is 'div.main_job_card'.
        const jobCardSelector = 'div.main_job_card';
        console.log(`Waiting for individual job cards: '${jobCardSelector}' to be visible...`);
        try {
            await page.waitForSelector(jobCardSelector, { visible: true, timeout: 30000 }); // Wait up to 30 seconds for job cards
            console.log("At least one job card is visible.");
        } catch (error) {
            console.error(`Timeout: No job cards ('${jobCardSelector}') became visible.`);
            console.error("This means the job listings might still be loading, or the selector for the cards is now incorrect.");
            return []; // Exit if job cards are not found
        }

        // Give it a tiny moment more for all cards to settle, if they're loaded in a batch.
        await page.waitForTimeout(1000); // Wait for 1 second

        // --- Data Extraction ---
        const extractedJobs = await page.evaluate(() => {
            const jobs = [];
            // Select all job cards
            const jobCards = document.querySelectorAll('div.main_job_card'); // Target the core job card class

            if (jobCards.length === 0) {
                console.warn("No 'div.main_job_card' elements found in the DOM during evaluation.");
                return [];
            }

            jobCards.forEach(card => {
                let jobTitle = 'N/A';
                let jobExperience = 'N/A';

                // Extract Job Title
                try {
                    const titleElement = card.querySelector('div.title_job'); // Selector for job title
                    if (titleElement) {
                        jobTitle = titleElement.innerText.trim();
                    }
                } catch (e) {
                    // console.error("Error extracting title:", e); // Log errors if necessary
                }

                // Extract Experience
                try {
                    const experienceElement = card.querySelector('div.experience'); // Selector for experience
                    if (experienceElement) {
                        jobExperience = experienceElement.innerText.trim();
                    }
                } catch (e) {
                    // console.error("Error extracting experience:", e); // Log errors if necessary
                }

                jobs.push({
                    title: jobTitle,
                    experience: jobExperience
                });
            });

            return jobs;
        });

        jobDetails.push(...extractedJobs);

    } catch (error) {
        console.error(`An overall error occurred during scraping: ${error.message}`);
        if (error.name === 'TimeoutError') {
            console.error("A timeout occurred during navigation or element waiting.");
        } else if (error.message.includes('ERR_CONNECTION_CLOSED') || error.message.includes('net::ERR_')) {
            console.error("A network or connection error prevented loading.");
        } else if (error.message.includes('browser has disconnected')) {
            console.error("The browser instance disconnected unexpectedly.");
        }
    } finally {
        if (browser) {
            await browser.close(); // Always ensure the browser is closed
            console.log("Browser closed.");
        }
    }
    return jobDetails;
}

// Immediately invoked async function to run the scraper
(async () => {
    console.log("Starting Excelssior Technologies careers page scraper...");
    const jobs = await getExcelssiorJobDetails();

    if (jobs.length > 0) {
        console.log("\n--- Found Job Openings ---");
        jobs.forEach(job => {
            console.log(`Job Title: ${job.title}, Experience: ${job.experience}`);
        });
    } else {
        console.log("No job details found or an error occurred.");
    }
})();