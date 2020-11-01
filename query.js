const mysql = require('mysql');

const pool = mysql.createPool({
    host: '47.112.149.215',
    port: 3307,
    user: 'chyjs',
    password: '123456',
    database: 'chyjs',
    multipleStatements: true,
    useConnectionPooling: true
})

module.exports = function query(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}