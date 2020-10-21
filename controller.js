const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
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
			sql = `select id, image_url, title, price, create_time from goods where title like '%${keyword}%' order by create_time desc limit ${(page-1)*pageSize}, ${pageSize}`;
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
        console.log(data);
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
		let date = moment(goods.create_time).format('YYYY-MM-DD hh:mm:ss');
		goods.create_time = new Date(date).getTime();
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
    getHomeNoteList: async function (req, res) {
        let {
            pageSize
        } = req.query;
        pageSize = pageSize ? pageSize : 6;
        let sql = `select id, title, img_url from note order by create_time desc limit ${pageSize}`;
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
		
		let sql = `select n1.id, n1.title, n1.img_url, n1.goods_id, n1.label, n1.create_time, group_concat(n2.img_url) as imgs from note n1
		,noteimg n2 where n1.id = n2.note_id GROUP BY n1.goods_id order by n1.create_time desc limit ${(page-1)*pageSize}, ${pageSize}`;
		let data = await query(sql);
		data.map( v => {
			v.imgs = v.imgs.split(',');
		});
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
	getGoodsByStatus: async function(req, res){
		let { status, page, pageSize } = req.query;
		page = page ? page : 1;
		pageSize = pageSize ? pageSize : 10;
		let sql = `select id, image_url, title, price, original, discount, activ_end_time, sell_point from goods where sold_status = ${status} limit ${(page-1)*pageSize}, ${pageSize}`;
		let data = await query(sql);
		data.map( v => {
			let date = moment(v.create_time).format('YYYY-MM-DD hh:mm:ss');
			v.create_time = new Date(date).getTime();
		});
		let resData = {
		    status: succStatus,
		    data: data
		}
		res.json(resData);
	},
	getRecommend: async function(req, res){
		let { pageSize } = req.query;
		pageSize = pageSize ? pageSize : 18;
		
		let sql = `SELECT id, title, price, image_url FROM goods ORDER BY RAND() LIMIT ${pageSize}`;
		let data = await query(sql);
		let resData = {
		    status: succStatus,
		    data: data
		}
		res.json(resData);
	},
	getOrderByUserId: async function(req, res){
		let { u_id, status } = req.query;
		let isStatus = ([1, 2, 3, 4].indexOf(status) !== -1);
		let sql = 'SELECT o.id, o.seller_id, o.goods_id, o.spec_id, o.status, o.total_num, o.total_price, s.nickname as shop_name, g.title, g.image_url, sp.spec_name, sp.price FROM `order` o ' +
			`INNER JOIN seller s on o.seller_id = s.id
			INNER JOIN goods g ON o.goods_id = g.id
			INNER JOIN spec sp ON o.spec_id = sp.id
			where o.user_id = ${u_id} ${isStatus ?'and o.status = '+status :''} order by o.create_time desc`;
		
		let data = await query(sql);
		let resData = {
		    status: succStatus,
		    data: data
		}
		res.json(resData);
	},
	getOrderDetails: async function(req, res){
		let { o_id } = req.query;
		let sql = 'select * from `order` where id = '+o_id;
		res.json({data:'aaa'});
	}
};

module.exports = controller;