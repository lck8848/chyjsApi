const express = require('express');
const multer = require('multer');
const controller = require('./controllerAdmin.js');

let upload = multer({
    dest: "./uploads/"
})
const route = express.Router();

//添加规格
route.post('/api/addSpec', controller.addSpec);

//添加轮播图
route.post('/api/addImages', controller.addImages);

//商品列表
route.get('/api/getGoodsList', controller.getGoodsList);

//商品列表
route.post('/api/getGoodsListByStatus', controller.getGoodsListByStatus);

//轮播图
route.post('/api/getImagesByGoods', controller.getImagesByGoods);

//删除轮播图 
route.post('/api/delImagesByGoods', controller.delImagesByGoods);

//规格
route.post('/api/getSpecByGoods', controller.getSpecByGoods);
route.post('/api/getSpec', controller.getSpec);
//删除规格
route.post('/api/delSpecByGoods', controller.delSpecByGoods);

//分类
route.post('/api/getAlias', controller.getAlias);

//分类
route.get('/api/getAliasList', controller.getAliasList);

//添加商品
route.post('/api/addGoods', controller.addGoods);

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
route.post('/api/getAddress', controller.getAddress);

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