// dbName: mydbuser1
// dbPassword: ZrIKHwah8M5tpBcG

const express = require('express')
const app = express()
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello my node js...')
})