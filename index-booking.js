const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "bublbe_press",
    database: "bublbe_main",
    password: "pswbublbe_press"
}).promise();

// получение объектов
connection.query("SELECT * FROM website")
    .then(result =>{
        console.log(result[0]);
    })
    .catch(err =>{
        console.log(err);
    });

return ;

const puppeteer = require('puppeteer');

let bookingUrl = 'https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaOkBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuALh34jzBcACAQ;sid=b2b3bdccb5ce9e6ce382bf9f77d1fa91;city=-1044367;from_idr=1&;dr_ps=IDR;ilp=1;d_dcp=1';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('div.bui-review-score__text').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();