const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)
        const links = [];
        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href')
            links.push(link)
        });

        let title;
        let texts = [];
        let imgs = [];
        links.map(link => {
            const pagina = axios.get(link)
            const html = pagina.data
            console.log(html)
            const $ = cheerio.load(html)

            title = $('title').text();
            texts = [];
            imgs = [];

            $('p').each((index, element) => {
                const text = $(element).text()
                texts.push(text)
            });
            $('img').each((index, element) => {
                const image = $(element).attr('src')
                imgs.push(image)
            });
        });

        res.send(`
        <h1>${title}</h1>
        <ul>
            ${texts.map(text => `<li>${text}</li>`).join('')}
        </ul>
        <ul>
            ${imgs.map(img => `<li><a href='https://es.wikipedia.org${img}' target='_blank'>${img}</a></li>`).join('')}
        </ul>
        <ul>
            ${links.map(lnk => `<li><a href='https://es.wikipedia.org${lnk}' target='_blank'>${lnk}</a></li>`).join('')}
        </ul>
        `)
    } catch {

    }
});

app.listen(3000, () => {
    console.log('Express server listening http://localhost:3000')
});