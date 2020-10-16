const axios = require('axios');
const query = require('./query.js');

const succStatus = 0;
const failStatus = 1;

const controller = {
    getSearchResult: async function(req, res){
        let { keyword, page, pageSize } = req.query;
        page = page ?page :1;
        pageSize = pageSize ?pageSize :10;
        let sql = `select * from goods where title like '%${keyword}%' limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getGift: async function(req, res){
        let { page, pageSize } = req.query;
        page = page ?page :1;
        pageSize = pageSize ?pageSize :10;

        let sql = `select * from goods where alias like '%1035%' limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getClassify: async function(req, res){
        let { genre } = req.query;

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
            data:data
        }
        res.json(resData);
    },
    getClassifyGoods: async function(req, res){
        let { aliasCode } = req.query;
        if(!aliasCode){
            res.json({satus: failStatus, message: "缺少aliasCode"});
            return;
        }
        let sql = `select * from goods where alias like '%${aliasCode}%'`;
        if(aliasCode === '1000'){
            sql = `select * from goods order by total_sold_num desc limit 10`;
        }
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data:data
        }
        res.json(resData);
    },
    getGoodsDetail: async function(req, res){
        let { g_id } = req.query;
        if(!g_id){
            res.json({satus: failStatus, message: "缺少g_id"});
            return;
        }
        let sql = `select * from goods where id = ${g_id}`;
        let data = [];
        try {
            data = await query(sql);
        }catch(error){
            res.json({satus: failStatus, message: error});
        }
        let message = data.length === 0 ?"商品不存在":"";
        
        let resData = {
            status: succStatus,
            message: message,
            data:data[0]
        }
        res.json(resData);
    },
    getHotGoods: async function(req, res){
        let sql = 'select * from goods order by total_sold_num desc limit 20';
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getNoteList: async function(req, res){
        let { page, pageSize } = req.query;
        page = page ?page :1;
        pageSize = pageSize ?pageSize :6;
        let sql = `select * from note limit ${(page-1)*pageSize}, ${pageSize}`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data:data
        }
        res.json(resData);
    },
    getNoteDetail: async function(req, res){
        let { n_id } = req.query;
        if(!n_id){
            res.json({satus: failStatus, message: "缺少n_id"});
            return;
        }
        let sql = `select * from note where id = ${n_id}`;
        let data = [];
        try {
            data = await query(sql);
        }catch(error){
            res.json({satus: failStatus, message: error});
        }
        let message = data.length === 0 ?"笔记不存在":"";
        
        let resData = {
            status: succStatus,
            message: message,
            data:data[0]
        }
        res.json(resData);
    },
    getOrderList: async function(req, res){
        let sql = 'select * from `order`';
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data:data
        }
        res.json(resData);
    },
    getAddress: async function(req, res){
        let { u_id } = req.query;
        if(!u_id){
            res.json({satus: failStatus, message: "缺少n_id"});
            return;
        }
        let sql = `select * from addr where user_id = ${u_id}`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data:data
        }
        res.json(resData);
    }
};

module.exports = controller;