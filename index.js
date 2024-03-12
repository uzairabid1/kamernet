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


//react data
const message = "Hello, my name is Denitsa. Can I come for a viewing?";
const gender = "Female";
const dob = "23-10-2004";
const stay = "5";
const occupation = "2";
const language = "English";
const pets  = "No";
const expectDate = "20-03-2024";
const totalPeople = 2;

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
    page = await methods.visitListings(page,username,message,gender,dob,stay,occupation,language,pets,expectDate,totalPeople);

}

main();