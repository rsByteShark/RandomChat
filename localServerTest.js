const http = require("http");
const express = require("express");
const path = require('path')
const { wssServerInit } = require("./websocketServer.js");

const app = express();

app.disable('x-powered-by');

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', "js", "css"],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders(res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}

app.use(express.static(path.join(__dirname, 'dist'), options));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'dist/index.html'));

})

app.get('/chatPage', (req, res) => {

    res.sendFile(path.join(__dirname, 'dist/chatPage.html'));

})


const server = http.createServer(app);

server.listen(3000, () => {

    console.log('local server listens on http://localhost:3000');


});


wssServerInit(server);