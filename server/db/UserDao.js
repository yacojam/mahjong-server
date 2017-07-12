const DBBase = require('./DBBase')

/** 创建用户,返回用户id **/
exports.sync_create_account = function(account, wxid, name, sex, headimg) {
    return new Promise(resolve => {
        if (account == null || name == null || account == '' || name == '') {
            resolve(0)
        }
        var sql =
            'INSERT INTO nv_users(account,wxid,name,sex,headimg) VALUES("' +
            account +
            '","' +
            wxid +
            '","' +
            name +
            '",' +
            sex +
            ',"' +
            headimg +
            '")'
        DBBase.query(sql, function(err, rows, fields) {
            //console.log(rows);
            if (err) {
                resolve(0)
            } else {
                resolve(rows.insertId)
            }
        })
    })
}

/** 获取用户信息，没有数据返回 null **/
exports.sync_get_account_info = function(account) {
    return new Promise(resolve => {
        if (account == null || account == '') {
            resolve(null)
        }
        var sql = 'SELECT * FROM nv_users WHERE account = "' + account + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null)
            }
            if (rows.length == 0) {
                resolve(null)
            }
            resolve(rows[0])
        })
    })
}

exports.sync_get_account_info_by_userid = function(userid) {
    return new Promise(resolve => {
        if (userid == null || userid == 0) {
            resolve(null)
        }
        var sql = 'SELECT * FROM nv_users WHERE userid = "' + userid + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null)
            }
            if (rows.length == 0) {
                resolve(null)
            }
            resolve(rows[0])
        })
    })
}

exports.sync_get_userid_of_account = function(account) {
    return new Promise(resolve => {
        if (account == null || account == '') {
            resolve(0)
        }
        var sql =
            'select userid from nv_users where account = "' + account + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(0)
            } else {
                resolve(rows[0].userid)
            }
        })
    })
}

//获取用户当前所在房间id
exports.sync_get_roomid_of_userid = function(userid) {
    return new Promise(resolve => {
        if (account == null || account == '') {
            resolve(null)
        }
        var sql = 'select roomid from nv_users where userid = "' + userid + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null)
            } else {
                resolve(rows[0].roomid)
            }
        })
    })
}

//更新用户的roomid
exports.sycn_update_roomid_of_userid = function(roomid, userid) {
    return new Promise(resolve => {
        var sql =
            'update nv_users set roomid = "' +
            roomid +
            '" where userid = "' +
            userid +
            '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(false)
            }
            resolve(true)
        })
    })
}

/** 获取用户当前的房卡数量 **/
exports.sycn_get_card_of_account = function(userid) {
    return new Promise(resolve => {
        if (userid == null || userid == '') {
            resolve(0)
        }
        var sql = 'select card from nv_users where userid = "' + userid + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(0)
            } else {
                if (rows.length > 0) {
                    resolve(rows[0].card)
                } else {
                    resolve(0)
                }
            }
        })
    })
}
