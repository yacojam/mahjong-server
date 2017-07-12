const DBBase = require('./DBBase')

/** 创建房间, 返回房间的id **/
exports.sync_create_room = function(
    userid,
    presentid,
    createTime,
    ruleid,
    baseInfo
) {
    return new Promise(resolve => {
        var sql =
            'insert into nv_rooms(presentid,baseInfo,ruleid,createTime,userid0) values("' +
            presentid +
            '","' +
            baseInfo +
            '",' +
            ruleid +
            ',"' +
            createTime +
            '",' +
            userid +
            ')'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(0)
            }
            resolve(rows.insertId)
        })
    })
}

/** 解散房间 **/
exports.sync_delete_room = function(userid, roomid) {
    return new Promise(resolve => {
        var sql =
            'update nv_rooms set roomvalid = 0 where userid0 = "' +
            userid +
            '" and id = ' +
            roomid +
            '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(false)
            }
            resolve(true)
        })
    })
}

/** 获取当前房间是不是有效 **/

exports.sync_is_room_valid = function(roomid) {
    return new Promise(resolve => {
        var sql = 'select roomvalid from nv_rooms where id = "' + roomid + '"'
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                resolve(0)
            }
            if (rows.length > 0) {
                resolve(rows[0].roomvalid)
            }
            resolve(0)
        })
    })
}
