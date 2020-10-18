const express = require('express');
const controller = require('./controller.js');
const route = express.Router();

//搜索
route.get('/api/getSearchResult', controller.getSearchResult);

//获取礼物
route.get('/api/getGift', controller.getGift);

//首页八宫格获取具体分类
route.get('/api/getClassify', controller.getClassify);

//根据classify的alias_code获取分类商品
route.get('/api/getClassifyGoods', controller.getClassifyGoods);

//商品详情
route.get('/api/getGoodsDetail', controller.getGoodsDetail);

//热销商品
route.get('/api/getHotGoods', controller.getHotGoods);

//笔记列表
route.get('/api/getNoteList', controller.getNoteList);

//笔记详情
route.get('/api/getNoteDetail', controller.getNoteDetail);

//订单列表
route.get('/api/getOrderList', controller.getOrderList);

//地址列表
route.get('/api/getAddress', controller.getAddress);

//地址列表
route.post('/api/getAdmin', controller.getAdmin);

module.exports = route;