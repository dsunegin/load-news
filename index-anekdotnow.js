const mysql = require("mysql2");
const axios = require('axios');
let iconv = require('iconv-lite');


const connectionJoke = mysql.createConnection({
    host: "localhost",
    user: "bublbe_press",
    database: "joke",
    password: "pswbublbe_press"
}).promise();

let indx = 0;
(async () => {
    while (indx>=0) {
        let jokeUrl = 'http://anekdotnow.ru/collection/' + indx + '.html';

        await axios.get(jokeUrl,
            { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                    'Accept': 'application/json;charset: utf-8'},
                responseType: 'arraybuffer',
                responseEncoding: 'binary'   })
        .then(response => {
            let decoded = iconv.decode(Buffer.from(response.data), 'win1251');
            let htmlResponse = response.data;
            const regexTopicBox = /<img.*?\/img\/bullet2\.gif.*?>(.*?)<img src=\'\/img\/bullet2\.gif.*?>/gs;
            //const regexTopicBox = /<div.*?class=\"text_main\"<hr>(.*?)<hr>/gs;

            while ((extracted = regexTopicBox.exec(decoded)) !== null) {
                let topicbox = extracted[1];

                const regexPost = /<br>(.*?)<br clear=\'all\'>/gmis;
                let extrPost = regexPost.exec(topicbox);
                if (extrPost == null) continue;
                let Post = extrPost[1];

                const regexVote = /<div.*?id=vote.*?<strong>.*?(\d+).*?<\/strong>/gs;
                let extrVote = regexVote.exec(topicbox);
                let Vote = extrVote !== null ? extrVote[1] : 0;

                /*const regexTag = /<h2.*?class=\"entry-title\".*?><a.*?>(.*?)<\/a><\/h2>/g;
                let extrTag = regexTag.exec(topicbox);
                let Tag = extrTag !== null ? extrTag[1] : "";*/

                const regexYear = /Добавлено:.*?\d+\-\d+\-(\d+)<\/td>/g;
                let extrYear = regexYear.exec(topicbox);
                let Year = extrYear !== null ? extrYear[1] : 2020;

                console.log(Post);
                console.log(Vote);
                console.log(Year);
                //console.log(Year);
                (async () => {
                    const sql = "INSERT INTO anekdot (post, rating, year ) VALUES (?,?,?)";
                    const anekdot = [Post, Vote, Year];
                    await connectionJoke.query(sql, anekdot)
                    .then(result => {
                        //console.log(result[0]);
                    })
                    .catch(err => {   console.log(err);    })
                })();

            }
            indx+=25;
            //page++;
            //console.log(response.data.url);
            //console.log(response.data.explanation);
        })
        .catch(error => {
            console.log(error);
            if (error.response.status == 404) indx = -1;
                })

        await wait(3000);

    } // End While

}) ();// end async


function wait(ms) {
    return new Promise( (resolve) => {setTimeout(resolve, ms)});
}

