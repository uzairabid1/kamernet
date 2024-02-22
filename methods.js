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
        await delay(1000);

        console.log("Logged in");
        return page;
    }catch(error){
        return false;
    }    
    
}

async function applyFilters(page, city, radius){
    const DISTANCE_INDEX = {
        '0': 1,
        '1': 2,
        '2': 3,
        '5': 4,
        '10': 5,
        '20': 6
    }

    let radiusValue = DISTANCE_INDEX[radius].toString();

    //select city
    await page.waitForXPath("//p[.='City or postal code']/parent::label/following-sibling::div/input");
    const [cityInput] = await page.$x("//p[.='City or postal code']/parent::label/following-sibling::div/input");
    await cityInput?.type(city,{delay:50});
    await cityInput?.focus();
    await delay(2000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //click radius button
    await page.waitForXPath("//div[@data-testid='radius-input']");
    const [radiusButton] = await page.$x("//div[@data-testid='radius-input']");
    await radiusButton.evaluate(radiusButton => radiusButton.click());
    await delay(600);

    //select the specified radius
    await page.waitForXPath(`//ul[@role='listbox']/li[${radiusValue}]`);
    const [radiusSelection] = await page.$x(`//ul[@role='listbox']/li[${radiusValue}]`);
    await radiusSelection.evaluate(radiusSelection => radiusSelection.click());
    await delay(600);
    

    //search button
    await page.waitForXPath("//button[.='Search']");
    const [submitButton] = await page.$x("//button[.='Search']");
    await submitButton.evaluate(submitButton => submitButton.click());
    await delay(2000);

}


module.exports = {login, applyFilters};
