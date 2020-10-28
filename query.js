const mysql = require('mysql');
var connection = mysql.createConnection({
    host: '47.112.149.215',
    port: 3307,
    user: 'chyjs',
    password: '123456',
    database: 'chyjs',
    multipleStatements: true
});
connection.connect(() => {
    console.log("数据库已连接");
});
connection.on('error', function (err) {
    console.log('db error', err);
    // 如果是连接断开，自动重新连接
    connection.connect(() => {
        console.log("数据库已连接");
    });
});

module.exports = function query(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results);
        });
    })
}