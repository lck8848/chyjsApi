const axios = require('axios');
const query = require('./query.js');

const succStatus = 0;
const failStatus = 1;

const controller = {
    getSearchResult: async function (req, res) {
        let {
            keyword,
            page,
            pageSize
        } = req.query;
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 10;
        let sql = `select * from goods where title like '%${keyword}%' limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getGift: async function (req, res) {
        let {
            page,
            pageSize
        } = req.query;
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 10;

        let sql = `select * from goods where alias like '%1035%' limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getClassify: async function (req, res) {
        let {
            genre
        } = req.query;

        switch (genre) {
            case 'gift':
                genre = 1035;
                break;
            case 'fruits':
                genre = 1032;
                break;
            case 'snacks':
                genre = 1031;
                break;
            case 'tea':
                genre = 1033;
                break;
            case 'liquor':
                genre = 1034;
                break;
            default:
                genre = 1000;
                break;
        }
        let sql = `select * from alias where genre like '%${genre}%'`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getClassifyGoods: async function (req, res) {
        let {
            aliasCode
        } = req.query;
        if (!aliasCode) {
            res.json({
                satus: failStatus,
                message: "缺少aliasCode"
            });
            return;
        }
        let sql = `select * from goods where alias like '%${aliasCode}%'`;
        if (aliasCode === '1000') {
            sql = `select * from goods order by total_sold_num desc limit 10`;
        }
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getGoodsDetail: async function (req, res) {
        let {
            g_id
        } = req.query;
        if (!g_id || !parseInt(g_id)) {
            let message = !g_id ? "缺少g_id" : "输入正确的g_id";
            res.json({
                satus: failStatus,
                message
            });
            return;
        }
        let sql = `select * from goods where id = ${g_id}`;
        let sql2 = `select * from images where goods_id = ${g_id}`;
        let queryArr = [query(sql), query(sql2)];
        let data = [];
        try {
            data = await Promise.all(queryArr);
        } catch (error) {
            res.json({
                satus: failStatus,
                message: error
            });
        }

        if (data[0].length === 0) {
            res.json({
                satus: failStatus,
                message: "商品不存在"
            });
            return;
        }
        data[0][0].images = data[1];
        let resData = {
            status: succStatus,
            data: data[0][0]
        }
        res.json(resData);
    },
    getHotGoods: async function (req, res) {
        let {
            pageSize
        } = req.query;
        pageSize = pageSize ? pageSize : 10;
        let sql = `select * from goods order by total_sold_num desc limit ${ pageSize }`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getNoteList: async function (req, res) {
        let {
            page,
            pageSize
        } = req.query;
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 6;
        let sql = `select * from note limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getNoteDetail: async function (req, res) {
        let {
            n_id
        } = req.query;
        if (!n_id) {
            res.json({
                satus: failStatus,
                message: "缺少n_id"
            });
            return;
        }
        let sql = `select * from note where id = ${n_id}`;
        let data = [];
        try {
            data = await query(sql);
        } catch (error) {
            res.json({
                satus: failStatus,
                message: error
            });
        }
        let message = data.length === 0 ? "笔记不存在" : "";

        let resData = {
            status: succStatus,
            message: message,
            data: data[0]
        }
        res.json(resData);
    },
    getOrderList: async function (req, res) {
        let sql = 'select * from `order`';
        let data = await query(sql);
        // console.log(data)
        data.map(v => {
            v.status == 1 && (v.status = "待付款");
            v.status == 2 && (v.status = "待收货");
            v.status == 3 && (v.status = "待发货");
            v.status == 4 && (v.status = "退款/售后");
            v.status == 5 && (v.status = "取消订单");
        })
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    getOrderListByStatus: async function (req, res) {
        let {
            status
        } = req.body;
        console.log(status);
        let sql;
        if (status != "") {
            sql = 'select * from `order` where status = ' + status;
        }else{
            sql = 'select * from `order`';
        }
            let data = await query(sql);
            // console.log(data)
            data.map(v => {
                v.status == 1 && (v.status = "待付款");
                v.status == 2 && (v.status = "待收货");
                v.status == 3 && (v.status = "待发货");
                v.status == 4 && (v.status = "退款/售后");
                v.status == 5 && (v.status = "取消订单");
            })
            let resData = {
                code: 20000,
                status: succStatus,
                data: {
                    total: data.length,
                    items: data
                }
            }
            res.json(resData);
    },
    getOrder: async function (req, res) {
        let {
            order_id
        } = req.body;
        let sql = 'select * from `order` where id = ' + order_id;
        let data = await query(sql);
        data.map(v => {
            v.status == 1 && (v.status = "待付款");
            v.status == 2 && (v.status = "待收货");
            v.status == 3 && (v.status = "待发货");
            v.status == 4 && (v.status = "退款/售后");
            v.status == 5 && (v.status = "取消订单");
        })
        let resData;
        if(data.length == 1){
            resData = {
                code: 20000,
                status: succStatus,
                data: data[0]
            }
        }else{
            resData= {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    delOrder: async function (req, res) {
        console.log(req.body);
        let {
            order_id
        } = req.body;
        let sql = 'delete from `order` where id = ' + order_id;
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    addOrder: async function (req, res) {
        let {
            user_id,
            addr_id,
            goods_id,
            spec_id,
            message,
            total_num,
            total_price,
            status,
          } = req.body;
        let sql = "INSERT INTO `order` (`user_id`, `addr_id`,`goods_id`, `spec_id`,`message`, `total_num`, `total_price`, `status`, `create_time`) VALUES ('"+user_id+"', '"+ addr_id+"', '"+goods_id+"', '"+spec_id+"', '"+message+"', '"+total_num+"', '"+total_price+"', '"+status+"', now())";
        let data = await query(sql);
        console.log(data);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    getAddress: async function (req, res) {
        let {
            u_id
        } = req.query;
        if (!u_id) {
            res.json({
                satus: failStatus,
                message: "缺少n_id"
            });
            return;
        }
        let sql = `select * from addr where user_id = ${u_id}`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getAdmin: async function (req, res) {
        // console.log(req.body)
        let {
            username,
            password
        } = req.body;
        if (!username || !password) {
            res.json({
                satus: failStatus,
                message: "缺少username/password"
            });
            return;
        }
        let sql = `select * from admin where username = '${username}' and password = '${password}'`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    userLogin: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": {
                "token": "admin-token"
            }
        }
        res.json(resData);
    },
    userInfo: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": {
                "roles": [
                    "admin"
                ],
                "introduction": "I am a super administrator",
                "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                "name": "Super Admin"
            }
        }
        res.json(resData);
    },
    userLogout: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": "success"
        }
        res.json(resData);
    }
};

module.exports = controller;