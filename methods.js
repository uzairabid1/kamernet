const sqlite3 = require('sqlite3').verbose();


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
} 

async function login(page,username,password){

    try{
        //click on login button
        await page.waitForXPath("//a[.='Log in']");
        const [loginButton] = await page.$x("//a[.='Log in']");
        await loginButton.evaluate(loginButton => loginButton.click());

        //check for cookies
        await page.waitForSelector('#cookiesRequest');
        const cookieConsentPopup = await page.$('#cookiesRequest');

        if (cookieConsentPopup) {
            console.log("Cookie consent popup found. Accepting cookies...");
            // Assuming there's a button to accept cookies, replace 'button.accept-cookies' with the actual selector
            await page.click('#_btnAcceptAllCookies');
        }

        await delay(500);
        //click on email field
        await page.waitForXPath("//div[@id='btnLoginEmail_inline']");
        const [emailChoiceButton] = await page.$x("//div[@id='btnLoginEmail_inline']");
        await emailChoiceButton.evaluate(emailChoiceButton => emailChoiceButton.click());
        await delay(500);
        //filling in with username and password
        await page.waitForXPath("//input[@id='UserEmail']");
        await page.type("#UserEmail",username,{delay:50});
        await page.type("#LoginPassword",password,{delay:50});
        await delay(1000);
        //clicking the submit button
        await page.waitForXPath("//button[.='Log in']");
        const [submitButton] = await page.$x("//button[.='Log in']");
        await submitButton.evaluate(submitButton => submitButton.click());
        await delay(4000);

        console.log("Logged in");
        return page;
    }catch(error){
        return false;
    }     
}



async function applyFilters(page, city, radius){

    //get url and search
    const DISTANCE_INDEX = {
        '0': 1,
        '1': 2,
        '2': 3,
        '5': 4,
        '10': 5,
        '20': 6
    }

    let radiusValue = DISTANCE_INDEX[radius].toString();

    await page.goto(`https://kamernet.nl/en/for-rent/rooms-${city.toLowerCase()}?radius=${radiusValue}&minSize=&maxRent=0&searchview=1`)
    await delay(2000);

    return page;
}

async function getListings(page){

    // getting listing urls
    let listings = [];

    await page.waitForSelector("a.ListingCard_root__xVYYt")
    let listings_elements = await page.$$("a.ListingCard_root__xVYYt");

    for (let element of listings_elements){
        let listingLink = await page.evaluate(element => element.getAttribute('href'),element);
        listings.push("https://kamernet.nl/" + listingLink); 
    }
    console.log(listings);
    return listings;
}


async function visitListings(page){   

    //visit listings
    let listings = await getListings(page);
    for(let listing of listings){
        await page.goto(listing);
        await delay(2000);
    }   
}

module.exports = {login, applyFilters, visitListings};
