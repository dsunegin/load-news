const mysql = require("mysql2");
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
        let jokeUrl = 'http://anekdot.if.ua/page/' + indx + '/';

        await axios.get(jokeUrl,{ headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }  })
        .then(response => {
            let htmlResponse = response.data;
            const regexTopicBox = /<div.*?class=\"post-.*?post type-post status-publish.*?id=\"post-.*?>(.*?)<\/div>.*?<\/div>/gs;
            while ((extracted = regexTopicBox.exec(htmlResponse)) !== null) {
                let topicbox = extracted[1];

                const regexHref = /<h2><a.*?href=\"(.*?)\"/gs;
                let extrHref = regexHref.exec(topicbox);
                if (extrHref == null) continue;
                let postHref = extrHref[1];

                (async () => {
                    await wait(1000);
                await axios.get(postHref,{ headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }  })
                .then(response => {
                    let postResponse = response.data;

                    const  regexTitle= /<div.*?class=\"posts.*?<h1>(.*?)<\/h1>/gs;
                    let extrTitle = regexTitle.exec(postResponse);
                    let PostTitle = extrTitle !== null ? extrTitle[1] : "";

                    const regexPost = /<div.*?class=\"posts.*?<div class=\"entry\">(.*?)<div class=\"socshare\"/gs;
                    let extrPost = regexPost.exec(postResponse);
                    let Post = extrPost !== null ? extrPost[1] : null;

                    const regexTag = /<div.*?class=\"posts.*?<div class=\"entry\".*?<p.*?class=\"tags\".*?<a.*?>(.*?)<\/a>/gs;
                    let extrTag = regexTag.exec(postResponse);
                    let Tag = extrTag !== null ? extrTag[1] : "";

                    if (Post !== null) {
                        Post = Post.replace(/<a\/?[^>]+>|<\/a>/igs, '');        // Strip ALL <a> tags from text but leave inner text.
                        console.log(Post);
                        //console.log(Vote);
                        console.log(Tag);
                        console.log(PostTitle);
                        //console.log(Year);
                        (async () => {
                            const sql = "INSERT INTO anekdotua (post, tag, title ) VALUES (?,?,?)";
                            const anekdot = [Post, Tag, PostTitle];
                            await connectionJoke.query(sql, anekdot)
                            .then(result => {
                                //console.log(result[0]);
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        })();
                    }

                }).catch(err => {   console.log(err);    })

                    await wait(3000);
                })();


                /*const regexPost = /<div.*?class=\"entry-summary entry-sub-title\".*?><blockquote.*?>(.*?)<\/blockquote><\/div>/gmis;
                let extrPost = regexPost.exec(topicbox);
                if (extrPost == null) continue;
                let Post = extrPost[1];*/

                /*const regexVote = /<span.*?class=\"text\".*?label=\"points\".*?>(.*?)<\/span>/gs;
                let extrVote = regexVote.exec(topicbox);
                let Vote = extrVote !== null ? extrVote[1] : 0;*/



                /*const regexYear = /<time.*?datetime=\"(.*?)-/g;
                let extrYear = regexYear.exec(topicbox);
                let Year = extrYear !== null ? extrYear[1] : 2020;*/



            }
            indx+=1;
            //page++;
            //console.log(response.data.url);
            //console.log(response.data.explanation);
        })
        .catch(error => {
            console.log(error);
            if (error.response.status == 404) indx = -1;
                })

        await wait(10000);

    } // End While

}) ();// end async


function wait(ms) {
    return new Promise( (resolve) => {setTimeout(resolve, ms)});
}

