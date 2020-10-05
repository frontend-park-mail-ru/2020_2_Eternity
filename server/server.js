const express = require('express')
const app = express()
const port = 3000

app.use(express.static(`${__dirname}/../public`));

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/../public/index.html`)
})

app.listen(port, (err) => {
    console.log(`server is listening on ${port}`)
})