const puppeteer = require('puppeteer');
let browserInstance = null;

async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('✅ Puppeteer browser launched successfully!');
    }
    browserInstance.on('disconnected', () => {
        console.error('⚠️ Puppeteer browser disconnected! Relaunching...');
        browserInstance = null;
    });
    return browserInstance;
}

module.exports = { getBrowser };