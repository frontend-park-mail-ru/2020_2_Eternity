const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const isPortReachable = require('is-port-reachable');

const app = express();

const port = process.argv.length >= 3 ? process.argv[2] : 3000;
const apiUrl = process.argv.length >= 4 ? process.argv[3] : 'localhost:8008';
console.log('Backend address is', apiUrl);

(async () => {
    const url = apiUrl.split(':');
    if (!await isPortReachable(apiUrl.includes(':') ? url[1] : 80, {host: url[0]})) {
        console.log('Backend server is not working');
        process.exit();
    }
})();

app.use(express.static(`${__dirname}/../dist`));

app.use('/api', (req, res, next) => {
    console.log(req.ip, 'api request', req.url);
    const modifiedURL = `${req.protocol}://${apiUrl}${req.url}`;
    proxy(modifiedURL)(req, res, next);
});

app.get('/*', (req, res) => {
    console.log(req.ip, 'page request', req.url);
    res.sendFile(path.resolve(`${__dirname}/../dist/index.html`));
});

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
