const mysql = require("mysql2");
//const puppeteer = require('puppeteer');

const axios = require('axios');

const connectionJoke = mysql.createConnection({
    host: "localhost",
    user: "bublbe_press",
    database: "joke",
    password: "pswbublbe_press"
}).promise();

const lastYear = 2021;

(async () => {
for (let year = 1998; year <= lastYear; year++ ) {
    let page = 1;
    //let ispageValid = true;
    while (page) {
        let jokeUrl = 'https://www.anekdot.ru/release/anekdot/year/' + year + '/' + page;

        await axios.get(jokeUrl)
        .then(response => {
            let htmlResponse = response.data;
            const regexTopicBox = /<div.*?class=\"topicbox\".*?<div.*?class=\"text\".*?>(.*?)<\/div><\/div>/g;
            while ((extracted = regexTopicBox.exec(htmlResponse)) !== null) {
                let topicbox = extracted[1];
                const regexPost = /^(.*?)<\/div>/g;
                let extrPost = regexPost.exec(topicbox);
                let Post = extrPost[1];

                const regexVote = /<div.*?class=\"votingbox\".*?<div.*?class=\"num\".*?>(.*?)<\/div>/g;
                let extrVote = regexVote.exec(topicbox);
                let Vote = extrVote !== null ? extrVote[1] : 0;

                const regexTag = /<div.*?class=\"tags\".*?<a.*?>(.*?)<\/a>/g;
                let extrTag = regexTag.exec(topicbox);
                let Tag = extrTag !== null ? extrTag[1] : "";

                console.log(Post);
                console.log(Vote);
                console.log(Tag);
                (async () => {
                    const sql = "INSERT INTO anekdot (post, rating, tag, year ) VALUES (?,?,?,?)";
                    const anekdot = [Post, Vote, Tag, year];
                    await connectionJoke.query(sql, anekdot)
                    .then(result => { //console.log(result[0]);
                    })
                    .catch(err => {   console.log(err);    })
                })();

            }
            page++;
            //console.log(response.data.url);
            //console.log(response.data.explanation);
        })
        .catch(error => {
            console.log(error);
            if (error.response.status == 404) page = false;
                })

        await wait(3000);

    } // End While
} // End For

}) ();// end async


function wait(ms) {
    return new Promise( (resolve) => {setTimeout(resolve, ms)});
}

