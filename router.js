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

//获取购物车根据用户id
route.post('/api/getCartByUserId', controller.getCartByUserId);

//获取具体分类
route.get('/api/getClassify', controller.getClassify);

//根据classify的alias_code获取分类商品
route.get('/api/getClassifyGoods', controller.getClassifyGoods);

//根据classify的alias_code获取分类所有商品
route.get('/api/getClassifyGoodsByAll', controller.getClassifyGoodsByAll);

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

//登录
route.post('/api/wxlogin', controller.wxlogin);

route.post('/api/addAddr', controller.addAddr);

// 查看当前用户的所有地址
route.get('/api/getAddr',controller.getAddr)
//查看指定地址
route.get('/api/getOneAddr',controller.getOneAddr)
//修改订单状态
route.post('/api/updateOrderStatus', controller.updateOrderStatus);

route.get('/api/checkToken', controller.checkToken);

route.get('/api/getFakingData', controller.getFakingData);

//修改用户属性
route.post('/api/updateUser', controller.updateUser);

route.post('/api/updateAddr', controller.updateAddr);

route.get('/api/deleteAddr', controller.deleteAddr);
route.get('/api/deleteUser', controller.deleteUser);

route.get('/api/getCartList', controller.getCartList);

route.get('/api/getSpec', controller.getSpec);

route.post('/api/updateCart', controller.updateCart);

route.get('/api/delCart', controller.delCart);

route.post('/api/addCart', controller.addCart);

route.post('/api/updateAllCart', controller.updateAllCart);

module.exports = route;