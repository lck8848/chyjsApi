const express = require('express');
const cors = require('cors');
const router = require('./router.js');
const routerAdmin = require('./routerAdmin.js');

const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors());

app.use(router);
app.use(routerAdmin);

app.listen('7001', () => {
    console.log("服务启动");
});