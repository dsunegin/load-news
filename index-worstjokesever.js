const mysql = require("mysql2");
//const puppeteer = require('puppeteer');

const axios = require('axios');

const connectionJoke = mysql.createConnection({
    host: "localhost",
    user: "bublbe_press",
    database: "joke",
    password: "pswbublbe_press"
}).promise();

let indx = 0;
(async () => {
    while (indx>=0) {
        let jokeUrl = 'https://worstjokesever.com/?skip=' + indx;

        await axios.get(jokeUrl)
        .then(response => {
            let htmlResponse = response.data;
            //let regexTopicBox = /<article.*?>(.*?)<\/article>/gmi;
            const regexTopicBox = /<div.*?class=\"jokes-list-item\".*?<article.*?class=\"joke\".*?>(.*?)<\/article>.*?<\/div>/gs;
            //let regexTopicBox = /<div.*?class=\"jokes-list-item\".*?>(.*?)<\/footer>/gmis;
            //let extract = regexTopicBox.exec(htmlResponse);
            while ((extracted = regexTopicBox.exec(htmlResponse)) !== null) {
                let topicbox = extracted[1];

                const regexPost = /<section.*?class=\"joke__content\".*?>(.*?)<\/section>/gmis;
                let extrPost = regexPost.exec(topicbox);
                if (extrPost == null) continue;
                let Post = extrPost[1];

                const regexVote = /<span.*?class=\"js-upvote-count.*?joke__button-text\".*?>(.*?)<\/span>/g;
                let extrVote = regexVote.exec(topicbox);
                let Vote = extrVote !== null ? extrVote[1] : 0;

                const regexTag = /<a.*?class=\"joke__tag-link\".*?>(.*?)<\/a>/g;
                let extrTag = regexTag.exec(topicbox);
                let Tag = extrTag !== null ? extrTag[1] : "";

                const regexYear = /<time.*?datetime=\"(.*?)-/g;
                let extrYear = regexYear.exec(topicbox);
                let Year = extrYear !== null ? extrYear[1] : 2020;

                console.log(Post);
                console.log(Vote);
                console.log(Tag);
                console.log(Year);
                (async () => {
                    const sql = "INSERT INTO worstjokes (post, rating, tag, year ) VALUES (?,?,?,?)";
                    const anekdot = [Post, Vote, Tag, Year];
                    await connectionJoke.query(sql, anekdot)
                    .then(result => { //console.log(result[0]);
                    })
                    .catch(err => {   console.log(err);    })
                })();

            }
            indx+=20;
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

