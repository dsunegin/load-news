const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const cron = require('node-cron');
const console = require('./console.js');
const envconf = require('dotenv').config();

if (envconf.error) {
    throw envconf.error;
} // ERROR if Config .env file is missing

//const clipboardy = require('clipboardy');
//const CRON=""
//const CRON="10 */13 * * * *";

//await page.type('div.D5aOJc.Hapztf', sourceString);
//clipboardy.writeSync(sourceString);

const main = async () => {
    try {
        let UA_default ='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
        let UA_random = randomUseragent.getRandom();
        let launchOptions = { headless: true, args: ['--start-maximized', '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'] };
        // define source and target language code
        let sourceLang = 'auto', targetLang = 'ru';

        let url_vote = 'https://focus.ua/ratings/481700-top-50-blogerov-ukrainy-rejting-fokusa/grupa-1/2836/dmitriy-vasilec';
        const browser = await puppeteer.launch(launchOptions);
        await browser.defaultBrowserContext().overridePermissions(url_vote, ['clipboard-read', 'clipboard-write']);
        const page = await browser.newPage();

        // set viewport and user agent (just in case for nice viewing)
        await page.setViewport({width: 1366, height: 768});
        await page.setUserAgent(UA_random);



        await page.goto(url_vote);
        await page.waitFor(15000);

        // detect the source textarea for input data (source string)
        //await page.waitForSelector('#source');

        await page.waitForSelector('div.js-rating-votes');
        await page.click('button.btn.btn-danger');
        await page.waitFor(5000);

        await page.waitForSelector('div.modal-content > div.modal-body > div.voting__title');
        // get the result string (translated text)
        const voteResult = await page.evaluate(() => {
            let row =document.querySelector('div.modal-content > div.modal-body > div.voting__title');
            return row.textContent;//[0].textContent;
        });

        console.log(voteResult);
        /*await page.waitForFunction(() =>
            [...document.querySelectorAll('div[class="asset"]')].some(e => e.textContent.includes('Assets Folder'))
        );*/

        await page.waitFor(30000);





        await page.waitFor(1000);
        await browser.close();

    } catch (err) {
        console.log(err);
        //if (err) throw err;
        return err.message;
    }
};

if (process.env.CRON) {
    console.log('Cron Scheduled');
    cron.schedule(
        process.env.CRON,
        () => {
            main()
            .then()
            .catch(err => console.error(err));
        },
        {scheduled: true}
    );
} else {
    main()
    .then(created => console.log(created))
    .catch(err => console.error(err));
}
