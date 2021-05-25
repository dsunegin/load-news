const mysql = require("mysql2");
const puppeteer = require('puppeteer');

/*const connection = mysql.createConnection({
    host: "localhost",
    user: "bublbe_press",
    database: "joke",
    password: "pswbublbe_press"
}).promise();*/

let year = 1998;
let month = 1;
let jokeUrl = 'https://www.anekdot.ru/release/anekdot/year/' + year + '/' + month;
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(jokeUrl, {waitUntil: 'networkidle2', timeout: 0});

    // get hotel details
    let pageData = await page.evaluate(() => {
        let jokes = [];
        // get the  elements
        let Elms = document.querySelectorAll('div.topicbox');
        // get the hotel data
        Elms.forEach((element) => {
            console.log(element);
            let elJson = {};
            /*try {

                elJson.text = element.querySelector('div.text').innerText;
                elJson.tags = element.querySelector('div.tags a').innerText;
                elJson.rating = element.querySelector('div.votingbox div.num').innerText;

            }
            catch (exception){}*/

            jokes.push(elJson);
        });
        console.dir(jokes);
        return jokes;
    });

    console.dir(pageData);

})();