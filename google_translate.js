const puppeteer = require('puppeteer');
const clipboardy = require('clipboardy');

//await page.type('div.D5aOJc.Hapztf', sourceString);
//clipboardy.writeSync(sourceString);

(async () => {
    let launchOptions = { headless: true, args: ['--start-maximized', '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage'] };
    // define source and target language code
    let sourceLang = 'auto', targetLang = 'ru';

    const browser = await puppeteer.launch(launchOptions);
    await browser.defaultBrowserContext().overridePermissions(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`, ['clipboard-read', 'clipboard-write']);
    const page = await browser.newPage();

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');



    await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`);

    // detect the source textarea for input data (source string)
    //await page.waitForSelector('#source');

    await page.waitForSelector('h2.oBOnKe');
    /*await page.waitForFunction(() =>
        [...document.querySelectorAll('div[class="asset"]')].some(e => e.textContent.includes('Assets Folder'))
    );*/

    await page.waitFor(1000);

    // string that we want to translate and type it on the textarea
    let sourceString = 'As reported by Reuters, Iran\'s two most powerful figures offered contrasting visions for the economy in speeches marking Iranian new year on Sunday, with Supreme Leader Ayatollah Ali Khamenei calling for self-reliance and President Hassan Rouhani urging cooperation with the world. In Nowruz speeches, Khamenei and Rouhani looked back on the past year, which saw sanctions on Iran lifted under a nuclear deal with world powers, and agreed the economy should be a top priority in the new Iranian year.But while Rouhani said further engagement with other countries was the key to economic growth, Khamenei reaffirmed his commitment to the concept of a "resistance economy" centred on self-sufficiency. The competing messages underscore differences between the two leaders, who both subscribe to the principles of the Islamic Republic but have divergent ideas about how it should engage with the global economy and in particular Western powers.\n';
    //await page.type('div.D5aOJc.Hapztf', sourceString);
    //clipboardy.writeSync(sourceString);
    /*require('child_process').exec(
        `echo "${sourceString}" | xclip`,

        function(err, stdout, stderr) {
            console.log(stdout); // to confirm the application has been run
            console.log(err);
            console.log(stderr);
        }
    );*/
    /*await page.click('div.D5aOJc.Hapztf')
    await page.waitFor(500);
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyV');
    await page.keyboard.up('Control');
    await page.keyboard.up('Shift');*/

    const to= await page.evaluate(() => {
        return navigator.clipboard.writeText('As reported by Reuters, Iran\'s two most powerful figures offered contrasting visions for the economy in speeches marking Iranian new year on Sunday, with Supreme Leader Ayatollah Ali Khamenei calling for self-reliance and President Hassan Rouhani urging cooperation with the world. In Nowruz speeches, Khamenei and Rouhani looked back on the past year, which saw sanctions on Iran lifted under a nuclear deal with world powers, and agreed the economy should be a top priority in the new Iranian year.But while Rouhani said further engagement with other countries was the key to economic growth, Khamenei reaffirmed his commitment to the concept of a "resistance economy" centred on self-sufficiency. The competing messages underscore differences between the two leaders, who both subscribe to the principles of the Islamic Republic but have divergent ideas about how it should engage with the global economy and in particular Western powers.\n');
    });
    await page.click('div.D5aOJc.Hapztf')
    await page.waitFor(500);
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyV');
    await page.keyboard.up('Control');
    await page.keyboard.up('Shift');

    // wait for the result container available
    await page.waitForSelector('span.JLqJ4b.ChMk0b > span');
    await page.waitFor(3000);

    // get the result string (translated text)
    const translatedResult = await page.evaluate(() => {
        let row =document.querySelectorAll('span.JLqJ4b.ChMk0b > span');
        return [...row].map(row => row.textContent).join();//[0].textContent;
    });

    // display the source and translated text to console
    console.log(`${sourceLang}: ${sourceString}\n${targetLang}: ${translatedResult}`);

    await page.waitFor(1000);
    await browser.close();
})();
