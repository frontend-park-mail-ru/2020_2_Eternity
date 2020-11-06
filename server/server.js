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
    const modifiedURL = `${req.protocol}://${apiUrl}${req.url}`;
    console.log(modifiedURL);
    proxy(modifiedURL)(req, res, next);
});

app.get('/*', (request, response) => {
    console.log(request.url);
    response.sendFile(path.resolve(`${__dirname}/../dist/index.html`));
});

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
