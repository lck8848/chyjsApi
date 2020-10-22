const express = require('express');
const multer = require('multer');
const controller = require('./controller.js');

let upload = multer({
    dest: "./uploads/"
})
const route = express.Router();

//搜索
route.get('/api/getSearchResult', controller.getSearchResult);

//获取礼物
route.get('/api/getGift', controller.getGift);

//获取具体分类
route.get('/api/getClassify', controller.getClassify);

//根据classify的alias_code获取分类商品
route.get('/api/getClassifyGoods', controller.getClassifyGoods);

//商品详情
route.get('/api/getGoodsDetail', controller.getGoodsDetail);

//热销商品
route.get('/api/getHotGoods', controller.getHotGoods);

//笔记首页列表
route.get('/api/getHomeNoteList', controller.getHomeNoteList);

// 笔记列表
route.get('/api/getNoteList', controller.getNoteList);

//笔记详情
route.get('/api/getNoteDetail', controller.getNoteDetail);

//根据商品状态获取商品
route.get('/api/getGoodsByStatus', controller.getGoodsByStatus);

//推荐商品
route.get('/api/getRecommend', controller.getRecommend);

//根据用户id获取订单
route.get('/api/getOrderByUserId', controller.getOrderByUserId);

//订单详情
route.get('/api/getOrderDetails', controller.getOrderDetails);

//根据商品ids字符串获取商品
route.get('/api/getGoodsByIds', controller.getGoodsByIds);

route.get('/api/getFakingData', controller.getFakingData);

module.exports = route;