var mysql = require('mysql')
var pool = null

function init() {
    pool = mysql.createPool({
        host: '106.15.206.180',
        user: 'test',
        password: 'Njnova211',
        port: '3306',
        database: 'Nova_game'
    })
}

init()

exports.query = function(sql, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null)
        } else {
            conn.query(sql, function(qerr, vals, fields) {
                //释放连接
                conn.release()
                //事件驱动回调
                callback(qerr, vals, fields)
            })
        }
    })
}
