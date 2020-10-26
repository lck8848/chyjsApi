const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const query = require('./query.js');
const { getToken, checkToken } = require('./util/token.js');
const rp = require('request-promise');

const succStatus = 0;
const failStatus = 1;

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
		data = data.filter(v => {
			return ![1031, 1032, 1033, 1034, 1035].includes(v.alias_code);
		});
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
		let sql;;
		if(aliasCode === '1051'){
			sql = `select id, image_url, title, price, sell_point from goods order by total_sold_num desc limit 10`;
		}else {
			sql = `select id, image_url, title, price, sell_point from goods where alias like '%${aliasCode}%' limit ${(page-1)*pageSize}, ${pageSize}`;
			
		}
		let data = await query(sql);
		data.map(v=>{
			v.show = true;
		})
        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getClassifyGoodsByAll: async function (req, res) {
        let {
            aliasCodes,
			page,
			pageSize
        } = req.query;
		page = page ? page : 1;
		pageSize = pageSize ? pageSize : 10;
        if (!aliasCodes) {
            res.json({
                satus: failStatus,
                message: "缺少aliasCode"
            });
            return;
		}
		let sqlStr = "";
		aliasCodes.split(",").map(v=>{
			let sql = `select id, image_url, title, price, sell_point from goods where alias like '%${v}%' limit ${(page-1)*pageSize}, ${pageSize};`;
			sqlStr += sql;
		})
		let data = await query(sqlStr);
		data.map(v=>{
			if(v.length != 0){
				v.map(d=>{
					d.show = false;
				})
			}

		})
		let resData = {
			status: succStatus,
			data
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
		//同时获取商品，商品规格，商品轮播图
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
        let sql = `select n.id, n.title, n.content, n.browse, n.favour, n.goods_id, n.create_time, s.shop_img, s.nickname as shop_name from note n
			INNER JOIN seller s ON s.id = n.seller_id where n.id = ${n_id}`;
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
		data.create_time = moment(data.create_time).format('YYYY-MM-DD hh:mm:ss');
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
		let { u_id, status, keyword } = req.query;
		//判断是否有在筛选状态
		let isStatus = (['1', '2', '3', '4'].indexOf(status) !== -1);
		//判断用户是否正在搜索
		let isKeyword = keyword !== '-1';
		let sql = 'SELECT o.id, o.status, o.total_num, o.total_price, s.nickname as shop_name, g.title, g.image_url, sp.spec_name, sp.price FROM `order` o ' +
			`INNER JOIN seller s on o.seller_id = s.id
			INNER JOIN goods g ON o.goods_id = g.id
			INNER JOIN spec sp ON o.spec_id = sp.id
			where o.user_id = ${u_id} ${isStatus ?'and o.status = '+status :''}
			 ${isKeyword ?'and (g.title like "%'+keyword+'%" or s.nickname like "%'+keyword+'%")' :'' }
			 order by o.create_time desc`;
		
		let data = await query(sql);
		let resData = {
		    status: succStatus,
		    data: data
		}
		res.json(resData);
	},
	getOrderDetails: async function(req, res){
		let { o_id } = req.query;
		let sql = 'select id, user_id, goods_id, addr_id, spec_id, status, message, total_num, total_price, orderNo, create_time from `order` where id = '+o_id;
		let data = await query(sql);
		data[0].create_time = moment(data[0].create_time).format('YYYY-MM-DD HH:mm:ss');
		//根据获得的订单获取对应的商品，商家，用户地址
		let sql2 = `select g.id, g.title, g.image_url, g.postage, s.spec_name, s.price, s.original, s2.nickname as shop_name from goods g
			INNER JOIN spec s ON s.goods_id = g.id
			INNER JOIN seller s2 ON s2.id = g.seller_id
			where s.id = ${data[0].spec_id} and g.id = ${data[0].goods_id}`;
		let sql3 = `select nickname, phone, addr_area, addr_detail, addr_house from addr where id = ${data[0].addr_id}`;
		let sqlArr = [query(sql2), query(sql3)];
		let data2 = await Promise.all(sqlArr);
		data[0].goods = data2[0][0];
		data[0].addr = data2[1][0];
		let resData = {
		    status: succStatus,
		    data: data[0]
		}
		res.json(resData);
	},
	getFakingData: async function(req, res){
		let sql = 'select * from faking';
		let data = await query(sql);
		res.json(data);
	},
	getGoodsByIds: async function(req, res){
		let { ids } = req.query;
		let sql = `select id, title, price, image_url from goods where id in (${ids})`;
		let data = await query(sql);
		let resData = {
		    status: succStatus,
		    data: data
		}
		res.json(resData);
	},
	addAddr: async function(req, res){
		let { addr } = req.body;
		let sql = `insert into addr(user_id, nickname, phone, addr_area, addr_detail, addr_house) 
		values(${addr.user_id}, '${addr.nickname}', '${addr.phone}', '${addr.addr_area}', '${addr.addr_detail}', '${addr.addr_house}')`;
		let data = await query(sql);
		let resData = {};
		resData.code = data.affectedRows > 0 ?succStatus :failStatus;
		res.json(resData);
	},
	updateOrderStatus: async function(req, res){
		let { oid, status } = req.body;
		
		let sql = 'update `order` set status = '+ status +` where id = ${oid}`;
		let data = await query(sql);
		let resData = {status: failStatus};
		if(data.affectedRows > 0){
			resData.status = succStatus;
		}
		
		res.json(resData);
	},
	wxlogin: async function(req, res){
		let { code, userInfo } = req.body;
		
		try {
		  const options = {
			method: 'GET',
			url: 'https://api.weixin.qq.com/sns/jscode2session',
			qs: {
			  grant_type: 'authorization_code',
			  js_code: code,
			  secret: "1d91825aacf2df83f733c9490b49d482",
			  appid: "wx39617bbe58d039fc"
			}
		  };
		  let sessionData = await rp(options);
		  sessionData = JSON.parse(sessionData);
		  if (!sessionData.openid) {
			res.json({status:failStatus, message:"获取失败"});
			return;
		  }
		  let token = getToken(sessionData, 1);
		  let sql = `select id,addr_id,goods_ids,phone,photo as img_url,name,sex,birthday,area,wx_number,balance,selfdom from user where open_id = '${sessionData.openid}'`;
		  let user = await query(sql);
		  if(!user[0]){
		  	let sql = `insert into user(photo, name, open_id) values('${userInfo.avatarUrl}', '${userInfo.nickName}', '${sessionData.openid}')`;
		  	let data = await query(sql);
			
		  	sql = `select id, addr_id, goods_ids, phone, photo as img_url, name, sex, birthday, area, wx_number, balance, selfdom from user where open_id = ${sessionData.openid}`;
		  	user = await query(sql);
		  }
		  user[0].birthday = moment(user[0].birthday).format("YYYY-MM-DD")
		  let resData = {
			token: token,
			user: user[0]
		  }
			res.json(resData)

		} catch (e) {
			res.json({status: failStatus, e});
		  return;
		}
	},
	checkToken: function(req, res){
		let { token } = req.query;
		let code = checkToken(token);
		if(!code){
			let resData = {
				status: failStatus,
				message: "err"
			}
			res.json(resData);
		}else {
			let resData = {
				status: succStatus,
				message: "ok"
			}
			res.json(resData); 
		}
	},
	updateUser: async function(req, res){
		let { user } = req.body;
		let objArr = Object.keys(user);
		let sql = `update user set ${objArr[1]} = '${user[objArr[1]]}' where id = ${user.id}`;
		let {affectedRows} = await query(sql);
		let resData = affectedRows > 0 ?{status: succStatus, message:'ok'} :{status: failStatus, message:'err'};
		res.json(resData);
	}

};

module.exports = controller;