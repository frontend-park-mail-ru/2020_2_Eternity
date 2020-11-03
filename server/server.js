const express = require('express')
const proxy = require('express-http-proxy');
const path = require('path')
const app = express()
const port = 80
const apiUrl = '127.0.0.1:8008'

app.use(express.static(`${__dirname}/../dist`));

app.use('/api', (req, res, next) => {
    const modifiedURL = `${req.protocol}://${apiUrl}${req.url}`
    proxy(modifiedURL)(req, res, next)
})

app.get('/*', (request, response) => {
    console.log(request.url)
    response.sendFile(path.resolve(`${__dirname}/../dist/index.html`))
})

app.listen(port, (err) => {
    console.log(`server is listening on ${port}`)
})