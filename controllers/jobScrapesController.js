// const puppeteer = require('puppeteer');
const { getBrowser } = require('../browser');


async function scrapeInfynnoJobs() {
    // const browser = await puppeteer.launch({ headless: 'new' });
    const browser = await getBrowser();
    const page = await browser.newPage();
    const url = 'https://infynno.com/career/';

    try {
        await page.goto(url, { waitUntil: 'networkidle2' , timeout: 30000  });
        const allJobs = await page.evaluate(() => {
            const jobTabs = document.querySelectorAll('.vc_tta-tab > a');
            const jobs = [];

            jobTabs.forEach(tab => {
                const jobTitle = tab.textContent.trim();
                const detailsPanelId = tab.getAttribute('href').substring(1);
                const detailsPanel = document.getElementById(detailsPanelId);

                let experience = null;
                let opening = null;

                if (detailsPanel) {
                    const detailsElement = detailsPanel.querySelector('.feature-box-content p:nth-child(7)');
                    if (detailsElement) {
                        const textContent = detailsElement.textContent.trim();
                        const lines = textContent.split('\n');

                        lines.forEach(line => {
                            const trimmedLine = line.trim();
                            if (trimmedLine.startsWith('Experience:')) {
                                experience = trimmedLine.replace('Experience:', '').trim();
                            } else if (trimmedLine.startsWith('Opening:')) {
                                opening = trimmedLine.replace('Opening:', '').trim();
                            }
                        });
                    }
                }
                jobs.push({ title: jobTitle, experience, opening });
            });
            return jobs;
        });
        return allJobs;
    } catch (error) {
        console.error(`Scraping Infynno failed:`, error);
        return null;
    } finally {
        await page.close();
    }
}

/**
 * Scrapes job details from the Excelsior Technologies website.
 */
async function scrapeExcelsiorJobs() {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const url = 'https://excelsiortechnologies.com/career';

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const allJobs = await page.evaluate(() => {
            // Select all job listing containers.
            const jobContainers = document.querySelectorAll('#blogListingDivId > div');
            const jobs = [];

            jobContainers.forEach(container => {
                const titleElement = container.querySelector('.title_job');
                const experienceElement = container.querySelector('.experiance');

                const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                const experience = experienceElement ? experienceElement.textContent.trim() : 'N/A';

                jobs.push({ title, experience });
            });
            return jobs;
        });
        return allJobs;
    } catch (error) {
        console.error(`Scraping Excelsior failed:`, error);
        return null;
    } finally {
        await page.close();
    }
}                                                                                                                                                                                                                                                                                                               

/**
 * Scrapes job details from the Acquaint Soft website.
 */
async function scrapeAcquaintSoftJobs() {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const url = 'https://acquaintsoft.com/careers';

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const allJobs = await page.evaluate(async () => {
            const jobContainers = document.querySelectorAll('dl > div');
            const jobs = [];

            for (const container of jobContainers) {
                const titleElement = container.querySelector('span.sm\\:w-1\\/5');
                const openingElement = container.querySelector('span.font-normal');

                const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                const opening = openingElement ? openingElement.textContent.trim().replace('Opening', '').trim() : 'N/A';

                // Find the ID for the collapsible content to get the experience
                const contentId = container.querySelector('button').getAttribute('aria-controls');
                const contentPanel = document.getElementById(contentId);

                let experience = 'N/A';
                if (contentPanel) {
                    // Find the paragraph with the experience details
                    const experienceP = contentPanel.querySelector('div.wysiwyg > p:nth-child(1)');
                    if (experienceP) {
                        experience = experienceP.textContent.trim();
                    }
                }
                jobs.push({ title, experience, opening });
            }
            return jobs;
        });
        return allJobs;
    } catch (error) {
        console.error(`Scraping Acquaint Soft failed:`, error);
        return null;
    } finally {
        await page.close();
    }
}

/**
 * A placeholder scraper for a hypothetical company.
 * You would replace the selectors and URL with the real ones.
 */
async function scrapeOtherCompanyJobs() {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const url = 'https://example-other-company-careers.com'; // Replace with the actual URL

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        const allJobs = await page.evaluate(() => {
            // **This is where you would put the CSS selectors for the new company.**
            // This is a placeholder and will not work on a real site.
            const jobElements = document.querySelectorAll('.job-listing');
            const jobs = [];

            jobElements.forEach(element => {
                const title = element.querySelector('.job-title').textContent.trim();
                const location = element.querySelector('.job-location').textContent.trim();
                jobs.push({ title, location });
            });
            return jobs;
        });
        return allJobs;
    } catch (error) {
        console.error(`Scraping hypothetical company failed:`, error);
        return null;
    } finally {
        await page.close();
    }
}

const getJobDetails = async (req, res) => {
    const { companyName } = req.params;
    let jobDetails = null;

    // Use a switch statement to call the correct scraper.
    switch (companyName.toLowerCase()) {
        case 'infynno':
            jobDetails = await scrapeInfynnoJobs();
            break;
        case 'excelsior':
            jobDetails = await scrapeExcelsiorJobs();
            break;
        case 'acquaintsoft':
            jobDetails = await scrapeAcquaintSoftJobs();
            break;
        case 'other-company': // This is a placeholder for your new company
            jobDetails = await scrapeOtherCompanyJobs();
            break;
        default:
            res.status(404).json({ error: `Scraper not found for company: ${companyName}` });
            return;
    }

    if (jobDetails) {
        res.json(jobDetails);
    } else {
        res.status(500).json({ error: 'Failed to retrieve job details.' });
    }
};

module.exports = {
    getJobDetails
};