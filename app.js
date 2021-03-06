const express = require('express');
const cors = require('cors');
const router = require('./router.js');

const app = express();

app.use('/', cors());
app.use('/', router);

app.listen('7001', () => {
    console.log("服务启动");
});