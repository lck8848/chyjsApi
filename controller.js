const axios = require('axios');
const fs = require('fs');
const query = require('./query.js');

const succStatus = 0;
const failStatus = 1;

let sold = {
    0: "正常",
    1: "满减",
    2: "优惠",
    3: "新品",
    4: "下架"
};
let del = {
    0: "未删除",
    1: "已删除"
}

const controller = {
    getSearchResult: async function (req, res) {
        let {
            keyword,
            page,
            pageSize,
			order
        } = req.query;
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 10;
		let sql;
		if(order === 'desc' || order === 'asc') {
			sql = `select id, image_url, title, price, create_time from goods where title like '%${keyword}%' order by price ${order} limit ${(page-1)*pageSize}, ${pageSize}`;
		}else if(order === 'new'){
			sql = `select id, image_url, title, price, create_time from goods where title like '%${keyword}%' order by create_time asc limit ${(page-1)*pageSize}, ${pageSize}`;
		}else {
			sql = `select id, image_url, title, price, create_time from goods where title like '%${keyword}%' limit ${(page-1)*pageSize}, ${pageSize}`;
		}
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

        let sql = `select id, image_url, title, price, sell_point from goods where alias like '%1035%' limit ${(page-1)*pageSize}, ${pageSize}`;
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
        let sql = `select id, alias_name, alias_code from alias where genre like '%${genre}%'`;
        let data = await query(sql);
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getClassifyGoods: async function (req, res) {
        let {
            aliasCode,
			page,
			pageSize
        } = req.query;
		page = page ? page : 1;
		pageSize = pageSize ? pageSize : 10;
        if (!aliasCode) {
            res.json({
                satus: failStatus,
                message: "缺少aliasCode"
            });
            return;
        }
        let sql = `select id, image_url, title, price, sell_point from goods where alias like '%${aliasCode}%' limit ${(page-1)*pageSize}, ${pageSize}`;
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
        let sql = `select id, seller_id, original, image_url, sell_point, discount, sold_status, title, details, 
		postage, spec_title, total_sold_num, activ_end_time from goods where id = ${g_id}`;
        let sql2 = `select * from images where goods_id = ${g_id}`;
		let sql3 = `select * from spec where goods_id = ${g_id}`;
        let queryArr = [query(sql), query(sql2), query(sql3)];
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
		let goods = data[0][0];
        goods.images = data[1];
		goods.speclist = data[2];
		let stock = 0;
		// 计算总数量
		data[2].map(v => {
			stock += v.stock_num;
		})
		goods.stock_num = stock;
		//计算最大和最小价格
		let arr = data[2].sort((v1, v2) => {
			return v1 - v2;
		})
		// 如果价格不一样就拼接价格范围
		goods.price = arr[0] !== arr[arr.length-1] ?arr[0].price.toFixed(2)+'-'+arr[arr.length-1].price.toFixed(2)
			:arr[0].price.toFixed(2);
			
        let resData = {
            status: succStatus,
            data: goods
        }
        res.json(resData);
    },
    getHotGoods: async function (req, res) {
        let {
            pageSize
        } = req.query;
        pageSize = pageSize ? pageSize : 10;
        let sql = `select id, image_url, title, price, sell_point from goods order by total_sold_num desc limit ${ pageSize }`;
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
    }
};

module.exports = controller;