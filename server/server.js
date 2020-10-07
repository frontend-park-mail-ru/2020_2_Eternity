const express = require('express')
const proxy = require('express-http-proxy');
const app = express()
const port = 3000
const apiUrl = '127.0.0.1:8008'

app.use(express.static(`${__dirname}/../public`));

app.use('/api', (req, res, next) => {
    const modifiedURL = `${req.protocol}://${apiUrl}${req.url}`
    proxy(modifiedURL)(req, res, next)
})

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/../public/index.html`)
})

app.listen(port, (err) => {
    console.log(`server is listening on ${port}`)
})