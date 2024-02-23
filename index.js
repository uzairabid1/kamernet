require("dotenv").config();

const methods = require('./methods');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

//account creds
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

//filters
const city = "Eindhoven";
const radius = '2';

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());



async function main(){
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-notifications',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--start-maximized'
        ]  
        });  

    let page = await browser.newPage();
    await page.goto('https://kamernet.nl/en');
    page = await methods.login(page,username,password);
    page = await methods.applyFilters(page,city,radius);
    page = await methods.visitListings(page);


}

main();



