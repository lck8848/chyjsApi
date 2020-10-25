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

async function queryAddr(addr_id) {
    let sql = `select * from addr where id = ${addr_id}`;
    let res = await query(sql);
    return res;
};
async function queryGoods(goods_id) {
    let sql = `select * from goods where id = ${goods_id}`;
    let res = await query(sql);
    return res;
};
async function querySpec(spec_id) {
    let sql = `select * from spec where id = ${spec_id}`;
    let res = await query(sql);
    return res;
};
async function querySeller(seller_id) {
    let sql = `select * from seller where id = ${seller_id}`;
    let res = await query(sql);
    return res;
};
async function queryUser(user_id) {
    let sql = `select * from user where id = ${user_id}`;
    let res = await query(sql);
    return res;
};
async function queryOrderInfo(orderInfo) {
    let a_res = await queryAddr(orderInfo.addr_id);
    let g_res = await queryGoods(orderInfo.goods_id);
    let s1_res = await querySpec(orderInfo.spec_id);
    let s2_res = await querySeller(orderInfo.seller_id);
    let u_res = await queryUser(orderInfo.user_id);
    return {
        addr: a_res[0],
        goods: g_res[0],
        spec: s1_res[0],
        seller: s2_res[0],
        user: u_res[0],
    }
};
async function queryAlias(alias_code) {
    let a_res = [];
    let sql = ""
    alias_code.split(",").map((v,k)=>{
        sql += "select * from `alias` where alias_code = '" + v + "'; ";
    })
    let res = await query(sql);
    return [].concat(...res); 
};
async function queryGoodsInfo(alias_code) {
    let a_res = await queryAlias(alias_code);
    return a_res;
};
const controller = {
    getGoodsList: async function (req, res) {
        let sql = 'select * from `goods`';
        let data = await query(sql);
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

    getAliasList: async function (req, res) {
        let sql = 'select * from `alias`';
        let data = await query(sql);
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
        } else if (sold_status) {
            sql = 'select * from `goods` where sold_status = ' + sold_status;
        } else if (is_delete) {
            sql = 'select * from `goods` where is_delete = ' + is_delete;
        } else {
            sql = 'select * from `goods`';
        }
        let data = await query(sql);
        data.map(v => {
            v.sold_status = sold[v.sold_status];
            v.is_delete = del[v.is_delete];
        })
        let resData;
        if (data.length >= 1) {
            resData = {
                code: 20000,
                status: succStatus,
                data: {
                    total: data.length,
                    items: data
                }
            }
        } else {
            resData = {
                code: 10000,
                status: failStatus
            }
        }
        res.json(resData);
    },
    getImagesByGoods: async function (req, res) {
        let {
            goods_id
        } = req.body;
        let sql = "select * from `images` where goods_id = '" + goods_id + "' and is_delete = '0'; ";
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
            alias_code,
            alias_id
        } = req.body;
        let resData;
        let sqlStr = "";
        if (alias_id) {
            sqlStr = "select * from `alias` where id = '" + alias_id + "';";
            let data = await query(sqlStr);
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
        } else {
            let aliasArr = alias_code.split(",");
            aliasArr.map(v => {
                sqlStr += "select * from `alias` where alias_code = '" + v + "'; ";
            })
            let data = await query(sqlStr);
            let alias_names = [];
            data.map(v => {
                v = v[0];
                if (v) {
                    alias_names.push(v.alias_name);
                }
            })
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
        }
        res.json(resData);
    },

    addGoods: async function (req, res) {
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
        if (activ_end_time == "null" || activ_end_time == "Invalid date") {
            sql = "INSERT INTO `goods` (`seller_id`, `price`, `original`, `alias`, `image_url`, `sell_point`, `discount`, `sold_status`, `title`, `details`, `postage`, `spec_title`, `total_sold_num`, `create_time`, `is_delete`) VALUES ('" + seller_id + "', '" + price + "', '" + original + "', '" + alias + "', '" + imageUrl + "', '" + sell_point + "', '" + discount + "', '" + sold_status + "', '" + title + "', '" + details + "', '" + postage + "', '" + spec_title + "', '" + total_sold_num + "', now(), '0');";
        } else {
            sql = "INSERT INTO `goods` (`seller_id`, `price`, `original`, `alias`, `image_url`, `sell_point`, `discount`, `sold_status`, `title`, `details`, `postage`, `spec_title`, `total_sold_num`, `activ_end_time`, `create_time`, `is_delete`) VALUES ('" + seller_id + "', '" + price + "', '" + original + "', '" + alias + "', '" + imageUrl + "', '" + sell_point + "', '" + discount + "', '" + sold_status + "', '" + title + "', '" + details + "', '" + postage + "', '" + spec_title + "', '" + total_sold_num + "', '" + activ_end_time + "', now(), '0');";
        }
        let data = await query(sql);
        let resData;
        if (data.affectedRows == 1) {
            resData = {
                code: 20000,
                insertId: data.insertId,
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
    updAlias: async function (req, res) {
        let {
            id,
            alias_name,
            genre
        } = req.body;
        let sql = "UPDATE `alias` SET `alias_name`='" + alias_name + "',`genre`='" + genre + "' WHERE (`id`='" + id + "');";
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
    updUser: async function (req, res) {
        let {
            id,
            photo,
            name,
            status
        } = req.body;
        let sql = "UPDATE `user` SET `photo`='" + photo + "', `name`='" + name + "', `status`='" + status + "' WHERE (`id`='" + id + "');";
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
    updSeller: async function (req, res) {
        let {
            id,
            nickname,
            shop_img,
            is_delete
        } = req.body;
        let sql = "UPDATE `seller` SET `nickname`='" + nickname + "', `shop_img`='" + shop_img + "', `is_delete`='" + is_delete + "' WHERE (`id`='" + id + "');";
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
    updCarousel: async function (req, res) {
        let {
            id,
            image_url,
            url,
            is_show
        } = req.body;
        let sql
        if (url) {
            sql = "UPDATE `carousel` SET `image_url`='" + image_url + "', `url`='" + url + "', `is_show`='" + is_show + "' WHERE (`id`='" + id + "');";
        } else {
            sql = "UPDATE `carousel` SET `image_url`='" + image_url + "', `is_show`='" + is_show + "' WHERE (`id`='" + id + "');";
        }
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
    getAliasMaxCode: async function (req, res) {
        let sql = 'SELECT MAX(alias_code) as max_alias_code from `alias`;';
        let data = await query(sql);
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
        let sql = "UPDATE `goods` SET `seller_id`='" + seller_id + "', `price`='" + price + "', `original`=" + original + ", `alias`='" + alias + "', `image_url`='" + image_url + "', `discount`='" + discount + "', `sold_status`='" + sold_status + "', `title`='" + title + "', `details`='" + details + "', `postage`='" + postage + "', `spec_title`='" + spec_title + "', `total_sold_num`='" + total_sold_num + "', ";
        if (activ_end_time == "null" || activ_end_time == "Invalid date") {
            sql += "`activ_end_time`=null, `is_delete`='" + is_delete + "' WHERE (`id`='" + id + "');";
        } else {
            sql += "`activ_end_time`='" + activ_end_time + "', `is_delete`='" + is_delete + "' WHERE (`id`='" + id + "');";
        }
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
    getSellerList: async function (req, res) {
        let sql = 'select * from `seller`';
        let data = await query(sql);
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
    getUserList: async function (req, res) {
        let sql = 'select * from `user`';
        let data = await query(sql);
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
    getCarouselList: async function (req, res) {
        let sql = 'select * from `carousel`';
        let data = await query(sql);
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
    getUserListByStatus: async function (req, res) {
        let {
            status
        } = req.body;
        let sql;
        if (!status) {
            sql = "select * from `user`;";
        } else {
            sql = "select * from `user` where status = '" + status + "';";
        }
        let data = await query(sql);
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
    getSellerListByStatus: async function (req, res) {
        let {
            is_delete
        } = req.body;
        let sql;
        if (is_delete == "") {
            sql = "select * from `seller`;";
        } else {
            sql = "select * from `seller` where is_delete = '" + is_delete + "';";
        }
        let data = await query(sql);
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
    getCarouselListByStatus: async function (req, res) {
        let {
            is_show
        } = req.body;
        let sql;
        if (is_show == "") {
            sql = "select * from `carousel`;";
        } else {
            sql = "select * from `carousel` where is_show = '" + is_show + "';";
        }
        let data = await query(sql);
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
        let sql;
        if (status != "") {
            sql = 'select * from `order` where status = ' + status;
        } else {
            sql = 'select * from `order`';
        }
        let data = await query(sql);
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
    getSellerById: async function (req, res) {
        let {
            seller_id
        } = req.body;
        let sql = 'select * from `seller` where id = ' + seller_id;
        let data = await query(sql);
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
    getGoodsInfo: async function (req, res) {
        let {
            aliasCodeArr
        } = req.body;
        let goodsArr = [];
        aliasCodeArr.map(async (v, k) => {
            let aliasInfo = await queryGoodsInfo(v);
            goodsArr.push(aliasInfo)
            if (k == aliasCodeArr.length - 1) {
                // console.log(goodsArr);
                let resData = {
                    code: 20000,
                    status: succStatus,
                    data: goodsArr
                }
                res.json(resData);
            }
        })
    },
    getOrderInfo: async function (req, res) {
        let {
            orderInfoArr
        } = req.body;
        let orderArr = [];
        orderInfoArr.map(async (v, k) => {
            let orderInfo = await queryOrderInfo(v);
            orderArr.push(orderInfo)
            if (k == orderInfoArr.length - 1) {
                // console.log(orderArr);
                let resData = {
                    code: 20000,
                    status: succStatus,
                    data: orderArr
                }
                res.json(resData);
            }
        })
    },
    getUser: async function (req, res) {
        let {
            user_id
        } = req.body;
        let sql = 'select * from `user` where id = ' + user_id;
        let data = await query(sql);
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
    getCarousel: async function (req, res) {
        let {
            carousel_id
        } = req.body;
        let sql = 'select * from `carousel` where id = ' + carousel_id;
        let data = await query(sql);
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
        let sql = "INSERT INTO `spec` (`goods_id`, `spec_name`, `price`, `original`, `stock_num`, `is_delete`) VALUES ('" + goods_id + "', '" + spec_name + "', '" + price + "', '" + original + "', '" + stock_num + "','0');";
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
        let sql = "UPDATE `spec` SET `is_delete`='1' WHERE (`goods_id`='" + goods_id + "');";
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
    addAlias: async function (req, res) {
        let {
            alias_name,
            alias_code,
            genre
        } = req.body;
        let sql = "INSERT INTO `alias` (`alias_name`, `alias_code`, `genre`) VALUES ('" + alias_name + "', '" + alias_code + "', '" + genre + "');";
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
    addSeller: async function (req, res) {
        let {
            username,
            password,
            nickname,
            shop_img
        } = req.body;
        let sql = "INSERT INTO `seller` (`username`, `password`, `nickname`, `shop_img`, `is_delete`) VALUES ('" + username + "', '" + password + "', '" + nickname + "', '" + shop_img + "', '0');";

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
    addCarousel: async function (req, res) {
        let {
            image_url,
            url,
            is_show
        } = req.body;
        let sql;
        if (url) {
            sql = "INSERT INTO `carousel` (`image_url`, `url`, `is_show`) VALUES ('" + image_url + "', '" + url + "', '" + is_show + "');";
        } else {
            sql = "INSERT INTO `carousel` (`image_url`, `url`, `is_show`) VALUES ('" + image_url + "', null, '" + is_show + "');";
        }

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
    addImages: async function (req, res) {
        let {
            goods_id,
            img_url
        } = req.body;
        let sql = "INSERT INTO `images` (`goods_id`, `img_url`, `is_delete`) VALUES ('" + goods_id + "', '" + img_url + "','0');";
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
        let sql = "UPDATE `images` SET `is_delete`='1' WHERE (`goods_id`='" + goods_id + "');";
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
    delSeller: async function (req, res) {
        let {
            seller_id
        } = req.body;
        let sql = "UPDATE `seller` SET `is_delete`='1' WHERE (`id`='" + seller_id + "');";
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
    delUser: async function (req, res) {
        let {
            user_id,
            status
        } = req.body;
        if (status == "") status = 2;
        let sql = "UPDATE `user` SET `status`='" + status + "' WHERE (`id`='" + user_id + "');";
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
    delCarousel: async function (req, res) {
        let {
            carousel_id
        } = req.body;
        let sql = 'delete from `carousel` where id = ' + carousel_id;
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
    delOrder: async function (req, res) {
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
        let sql = "UPDATE `order` SET `user_id`='" + user_id + "', `seller_id`='" + seller_id + "', `goods_id`='" + goods_id + "', `addr_id`='" + addr_id + "', `spec_id`='" + spec_id + "', `status`='" + status + "', `message`='" + message + "', `total_num`='" + total_num + "', `total_price`='" + total_price + "' WHERE (`id`='" + id + "')";
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
        if (u_id) {
            sql = `select * from addr where user_id = ${u_id}`;
        } else if (addr_id) {
            sql = `select * from addr where id = ${addr_id}`;
        }
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    getSellerByUsername: async function (req, res) {
        let {
            username
        } = req.body;
        let sql = `select * from seller where username = '${username}';`;
        let data = await query(sql);
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
    getAdminByUsername: async function (req, res) {
        let {
            username
        } = req.body;
        let sql = `select * from admin where username = '${username}';`;
        let data = await query(sql);
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
    getAdmin: async function (req, res) {
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
        let sql = `select * from seller where username = '${username}' and password = '${password}' and is_delete = '0'`;
        let data = await query(sql);

        let resData = {
            status: succStatus,
            data: data
        }
        res.json(resData);
    },
    readImg: async function (req, res) {
        res.sendFile(__dirname + req.query.url);
    },
    readImgAddr: async function (req, res) {
        res.json("http://localhost:7001/api/uploads?url=" + req.query.url);
    },
    uploadFeature: async function (req, res) {
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