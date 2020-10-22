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
    getGoodsList: async function (req, res) {
        let sql = 'select * from `goods`';
        let data = await query(sql);
        // console.log(data)
        data.map(v => {
            v.sold_status = sold[v.sold_status];
            v.is_delete = del[v.is_delete];
        })
        // console.log(data);
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    
    getAliasList: async function (req, res) {
        let sql = 'select * from `alias`';
        let data = await query(sql);
        // console.log(data);
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    getGoodsListByStatus: async function (req, res) {
        let {
            sold_status,
            is_delete
        } = req.body;
        let sql;
        if (sold_status && is_delete) {
            sql = 'select * from `goods` where sold_status = ' + sold_status + " and is_delete = " + is_delete;
        } else if(sold_status){
            sql = 'select * from `goods` where sold_status = ' + sold_status;
        } else if(is_delete){
            sql = 'select * from `goods` where is_delete = ' + is_delete;
        }else {
            sql = 'select * from `goods`';
        }
        let data = await query(sql);
        // console.log(data)
        data.map(v => {
            v.sold_status = sold[v.sold_status];
            v.is_delete = del[v.is_delete];
        })
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    getImagesByGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = "select * from `images` where goods_id = '" + goods_id + "' and is_delete = '0'; ";
        // console.log(sqlStr);
        let data = await query(sql);
        let resData;
        if (data.length >= 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    getSpecByGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = "select * from `spec` where goods_id = '" + goods_id + "' and is_delete = '0'; ";
        // console.log(sqlStr);
        let data = await query(sql);
        let resData;
        if (data.length >= 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    getSpec: async function (req, res) {
        let {
            spec_id
        } = req.body;
        let sql = "select * from `spec` where id = '" + spec_id + "'; ";
        // console.log(sqlStr);
        let data = await query(sql);
        let resData;
        if (data.length >= 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    getAlias: async function (req, res) {
        let {
            alias_code
        } = req.body;
        let aliasArr = alias_code.split(",");
        let sqlStr = "";
        aliasArr.map(v=>{
            sqlStr += "select * from `alias` where alias_code = '" + v + "'; ";
        })
        // console.log(sqlStr);
        let data = await query(sqlStr);
        let alias_names = [];
        data.map(v=>{
            v = v[0];
            // console.log(v.alias_name);
            if(v){
                alias_names.push(v.alias_name);
            }
        })
        let resData;
        if (data.length >= 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data,
                alias_names
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    
    addGoods: async function (req, res) {
        
    //   console.log("this.seller_id",this.seller_id);
    //   console.log("this.price",this.price);
    //   console.log("this.original",this.original);
    //   console.log("this.alias",this.alias);
    //   console.log("this.imageUrl",this.imageUrl);
    //   console.log("this.sell_point",this.sell_point);
    //   console.log("this.discount",this.discount);
    //   console.log("this.sold_status",this.sold_status);
    //   console.log("this.title",this.title);
    //   console.log("this.details",this.details);
    //   console.log("this.postage",this.postage);
    //   console.log("this.spec_title",this.spec_title);
    //   console.log("this.total_sold_num",this.total_sold_num);
    //   console.log("this.activ_end_time",this.activ_end_time);
        let {
            seller_id,
            price,
            alias,
            original,
            imageUrl,
            sell_point,
            discount,
            sold_status,
            title,
            details,
            postage,
            spec_title,
            total_sold_num,
            activ_end_time
        } = req.body;
        let sql;
        if(activ_end_time == "null" || activ_end_time == "Invalid date"){
            sql = "INSERT INTO `goods` (`seller_id`, `price`, `original`, `alias`, `image_url`, `sell_point`, `discount`, `sold_status`, `title`, `details`, `postage`, `spec_title`, `total_sold_num`, `create_time`, `is_delete`) VALUES ('"+seller_id+"', '"+price+"', '"+original+"', '"+alias+"', '"+imageUrl+"', '"+sell_point+"', '"+discount+"', '"+sold_status+"', '"+title+"', '"+details+"', '"+postage+"', '"+spec_title+"', '"+total_sold_num+"', now(), '0');";
        }else{
            sql = "INSERT INTO `goods` (`seller_id`, `price`, `original`, `alias`, `image_url`, `sell_point`, `discount`, `sold_status`, `title`, `details`, `postage`, `spec_title`, `total_sold_num`, `activ_end_time`, `create_time`, `is_delete`) VALUES ('"+seller_id+"', '"+price+"', '"+original+"', '"+alias+"', '"+imageUrl+"', '"+sell_point+"', '"+discount+"', '"+sold_status+"', '"+title+"', '"+details+"', '"+postage+"', '"+spec_title+"', '"+total_sold_num+"', '"+activ_end_time+"', now(), '0');";
        }
        console.log(sql);
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                insertId:data.insertId,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    getGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = 'select * from `goods` where id = ' + goods_id;
        let data = await query(sql);
        data.map(v => {
            v.sold_status = sold[v.sold_status];
            v.is_delete = del[v.is_delete];
        })
        let resData;
        if (data.length == 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data: data[0]
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    updGoods: async function (req, res) {
        let {
            id,
            seller_id,
            price,
            original,
            alias,
            image_url,
            discount,
            sold_status,
            title,
            details,
            postage,
            spec_title,
            total_sold_num,
            activ_end_time,
            is_delete
        } = req.body;
        // console.log(activ_end_time);
        let sql = "UPDATE `goods` SET `seller_id`='"+seller_id+"', `price`='"+price+"', `original`="+original+", `alias`='"+alias+"', `image_url`='"+image_url+"', `discount`='"+discount+"', `sold_status`='"+sold_status+"', `title`='"+title+"', `details`='"+details+"', `postage`='"+postage+"', `spec_title`='"+spec_title+"', `total_sold_num`='"+total_sold_num+"', ";
        if(activ_end_time == "null" || activ_end_time == "Invalid date"){
            sql += "`activ_end_time`=null, `is_delete`='"+is_delete+"' WHERE (`id`='"+id+"');";
        }else{
            sql += "`activ_end_time`='"+activ_end_time+"', `is_delete`='"+is_delete+"' WHERE (`id`='"+id+"');";
        }
        // console.log(sql);
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    getOrderList: async function (req, res) {
        let sql = 'select * from `order`';
        let data = await query(sql);
        // console.log(data)
        data.map(v => {
            v.status == 1 && (v.status = "待付款");
            v.status == 2 && (v.status = "待收货");
            v.status == 3 && (v.status = "待发货");
            v.status == 4 && (v.status = "退款/售后");
            v.status == 5 && (v.status = "取消订单");
        })
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    getOrderListByStatus: async function (req, res) {
        let {
            status
        } = req.body;
        console.log(status);
        let sql;
        if (status != "") {
            sql = 'select * from `order` where status = ' + status;
        } else {
            sql = 'select * from `order`';
        }
        let data = await query(sql);
        // console.log(data)
        data.map(v => {
            v.status == 1 && (v.status = "待付款");
            v.status == 2 && (v.status = "待收货");
            v.status == 3 && (v.status = "待发货");
            v.status == 4 && (v.status = "退款/售后");
            v.status == 5 && (v.status = "取消订单");
        })
        let resData = {
            code: 20000,
            status: succStatus,
            data: {
                total: data.length,
                items: data
            }
        }
        res.json(resData);
    },
    getOrder: async function (req, res) {
        let {
            order_id
        } = req.body;
        let sql = 'select * from `order` where id = ' + order_id;
        let data = await query(sql);
        data.map(v => {
            v.status == 1 && (v.status = "待付款");
            v.status == 2 && (v.status = "待收货");
            v.status == 3 && (v.status = "待发货");
            v.status == 4 && (v.status = "退款/售后");
            v.status == 5 && (v.status = "取消订单");
        })
        let resData;
        if (data.length == 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data: data[0]
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    addSpec: async function (req, res) {
        let {
            goods_id,
            spec_name,
            price,
            original,
            stock_num
        } = req.body;
        let sql = "INSERT INTO `spec` (`goods_id`, `spec_name`, `price`, `original`, `stock_num`, `is_delete`) VALUES ('"+goods_id+"', '"+spec_name+"', '"+price+"', '"+original+"', '"+stock_num+"','0');";
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    
    delSpecByGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = "UPDATE `spec` SET `is_delete`='1' WHERE (`goods_id`='"+goods_id+"');";
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    addImages: async function (req, res) {
        let {
            goods_id,
            img_url
        } = req.body;
        let sql = "INSERT INTO `images` (`goods_id`, `img_url`, `is_delete`) VALUES ('"+goods_id+"', '"+img_url+"','0');";
        let data = await query(sql);
        let resData;
        if (data.affectedRows >= 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    
    delImagesByGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = "UPDATE `images` SET `is_delete`='1' WHERE (`goods_id`='"+goods_id+"');";
        let data = await query(sql);
        let resData;
        if (data.affectedRows >= 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    delOrder: async function (req, res) {
        console.log(req.body);
        let {
            order_id
        } = req.body;
        let sql = 'delete from `order` where id = ' + order_id;
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    addOrder: async function (req, res) {
        let {
            user_id,
            seller_id,
            addr_id,
            goods_id,
            spec_id,
            message,
            total_num,
            total_price,
            status,
        } = req.body;
        let sql = "INSERT INTO `order` (`user_id`,`seller_id`, `addr_id`,`goods_id`, `spec_id`,`message`, `total_num`, `total_price`, `status`, `create_time`) VALUES ('" + user_id + "', '" + seller_id + "', '" + addr_id + "', '" + goods_id + "', '" + spec_id + "', '" + message + "', '" + total_num + "', '" + total_price + "', '" + status + "', now())";
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    updOrder: async function (req, res) {
        let {
            id,
            user_id,
            seller_id,
            addr_id,
            goods_id,
            spec_id,
            message,
            total_num,
            total_price,
            status,
        } = req.body;
        let sql = "UPDATE `order` SET `user_id`='" + user_id+ "', `seller_id`='" + seller_id + "', `goods_id`='" + goods_id + "', `addr_id`='" + addr_id + "', `spec_id`='" + spec_id + "', `status`='" + status + "', `message`='" + message + "', `total_num`='" + total_num + "', `total_price`='" + total_price + "' WHERE (`id`='" + id + "')";
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                status: succStatus
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }

        res.json(resData);
    },
    getAddress: async function (req, res) {
        let {
            u_id,
            addr_id
        } = req.body;
        let sql
        if(u_id){
            sql = `select * from addr where user_id = ${u_id}`;
        }else if(addr_id){
            sql = `select * from addr where id = ${addr_id}`;
        }
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getAdmin: async function (req, res) {
        // console.log(req.body)
        let {
            username,
            password
        } = req.body;
        if (!username || !password) {
            res.json({
                satus: failStatus,
                message: "缺少username/password"
            });
            return;
        }
        let sql = `select * from admin where username = '${username}' and password = '${password}'`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getSeller: async function (req, res) {
        // console.log(req.body)
        let {
            username,
            password
        } = req.body;
        if (!username || !password) {
            res.json({
                satus: failStatus,
                message: "缺少username/password"
            });
            return;
        }
        let sql = `select * from seller where username = '${username}' and password = '${password}'`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    readImg: async function(req,res){
        res.sendFile( __dirname + req.query.url);
        console.log("Request for " + __dirname + req.query.url + " received.");
    },
    readImgAddr: async function(req,res){
        res.json("http://localhost:7001/api/uploads?url=" + req.query.url);
    },
    uploadFeature: async function (req,res){
        if (req.file) {
            let {
                originalname,
                destination,
                filename
            } = req.file;
            var ext = originalname.substring(originalname.lastIndexOf("."));
            let oldPath = destination + filename;
            let newPath = destination + filename + ext;
            fs.rename(oldPath, newPath, err => {
                if (err) throw err;
                newPath = newPath.substring(1);
                res.json({
                    newPath
                });
            })
        }
    },
    userLogin: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": {
                "token": "admin-token"
            }
        }
        res.json(resData);
    },
    userInfo: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": {
                "roles": [
                    "admin"
                ],
                "introduction": "I am a super administrator",
                "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
                "name": "Super Admin"
            }
        }
        res.json(resData);
    },
    userLogout: async function (req, res) {
        let resData = {
            "code": 20000,
            "data": "success"
        }
        res.json(resData);
    }
};

module.exports = controller;