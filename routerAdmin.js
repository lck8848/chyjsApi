const express = require('express');
const multer = require('multer');
const controller = require('./controllerAdmin.js');

let upload = multer({
    dest: "./uploads/"
})
const route = express.Router();

//添加规格
route.post('/api/addSpec', controller.addSpec);

//修改用户
route.post('/api/updUser', controller.updUser);

//修改轮播图 
route.post('/api/updCarousel', controller.updCarousel);

//修改分类
route.post('/api/updAlias', controller.updAlias);

//添加轮播图
route.post('/api/addImages', controller.addImages);

//商品列表
route.get('/api/getGoodsList', controller.getGoodsList);

//用户
route.post('/api/getUser', controller.getUser);

//用户列表
route.get('/api/getUserList', controller.getUserList);

//轮播图
route.post('/api/getCarousel', controller.getCarousel);

//获取商家
route.post('/api/getSellerById', controller.getSellerById);

//商家列表
route.get('/api/getSellerList', controller.getSellerList);

//轮播图列表
route.get('/api/getCarouselList', controller.getCarouselList);

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

//获取分类最大类别码
route.get('/api/getAliasMaxCode', controller.getAliasMaxCode);

//添加商品
route.post('/api/addGoods', controller.addGoods);

//添加商家
route.post('/api/addSeller', controller.addSeller);

//添加轮播图
route.post('/api/addCarousel', controller.addCarousel);

//添加分类
route.post('/api/addAlias', controller.addAlias);

//商品
route.post('/api/getGoods', controller.getGoods);

//修改商家
route.post('/api/updSeller', controller.updSeller);

//修改/删除商品
route.post('/api/updGoods', controller.updGoods);

//订单列表
route.get('/api/getOrderList', controller.getOrderList);

//商家列表
route.post('/api/getSellerListByStatus', controller.getSellerListByStatus);

//轮播图列表
route.post('/api/getCarouselListByStatus', controller.getCarouselListByStatus);

//用户列表
route.post('/api/getUserListByStatus', controller.getUserListByStatus);

//订单列表
route.post('/api/getOrderListByStatus', controller.getOrderListByStatus);

//订单
route.post('/api/getOrder', controller.getOrder);

//删除轮播图
route.post('/api/delCarousel', controller.delCarousel);

//删除用户
route.post('/api/delUser', controller.delUser);

//删除商家
route.post('/api/delSeller', controller.delSeller);

//删除订单 
route.post('/api/delOrder', controller.delOrder);

//添加订单 
route.post('/api/addOrder', controller.addOrder);

//修改订单 
route.post('/api/updOrder', controller.updOrder);

//地址列表
route.post('/api/getAddress', controller.getAddress);

//管理员
route.post('/api/getSellerByUsername', controller.getSellerByUsername);

//订单信息
route.post('/api/getOrderInfo', controller.getOrderInfo);

//分类信息
route.post('/api/getGoodsInfo', controller.getGoodsInfo);

//管理员
route.post('/api/getAdminByUsername', controller.getAdminByUsername);

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