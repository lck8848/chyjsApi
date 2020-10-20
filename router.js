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

//笔记列表
route.get('/api/getNoteList', controller.getNoteList);

//笔记详情
route.get('/api/getNoteDetail', controller.getNoteDetail);

//商品列表
route.get('/api/getGoodsList', controller.getGoodsList);

//商品列表
route.post('/api/getGoodsListByStatus', controller.getGoodsListByStatus);

//分类
route.post('/api/getAlias', controller.getAlias);

//分类
route.get('/api/getAliasList', controller.getAliasList);

//商品
route.post('/api/getGoods', controller.getGoods);

//修改/删除商品
route.post('/api/updGoods', controller.updGoods);

//订单列表
route.get('/api/getOrderList', controller.getOrderList);

//订单列表
route.post('/api/getOrderListByStatus', controller.getOrderListByStatus);

//订单
route.post('/api/getOrder', controller.getOrder);

//删除订单 
route.post('/api/delOrder', controller.delOrder);

//添加订单 
route.post('/api/addOrder', controller.addOrder);

//添加订单 
route.post('/api/updOrder', controller.updOrder);

//地址列表
route.get('/api/getAddress', controller.getAddress);

//管理员
route.post('/api/getAdmin', controller.getAdmin);

//商家
route.post('/api/getSeller', controller.getSeller);

//读取本地图片
route.get('/api/uploads', controller.readImg);

//读取本地图片地址
route.get('/api/uploads/imgUrl', controller.readImgAddr);

//文件上传
route.post("/api/uploadFeature", upload.single('feature'), controller.uploadFeature);

//模拟后台模板数据
route.get('/api/user/info', controller.userInfo);

//模拟后台退出模板数据
route.post('/api/user/logout', controller.userLogout);

//模拟后台登录模板数据
route.post('/api/user/login', controller.userLogin);

module.exports = route;