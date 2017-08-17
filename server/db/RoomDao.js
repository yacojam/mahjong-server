const DBBase = require('./DBBase')

/** 创建房间, 返回房间的id **/
exports.sync_create_room = function(userid, presentid, createTime, baseInfo) {
    return new Promise(resolve => {
        var sql =
            'insert into nv_rooms(presentid,baseinfo,createtime,createuserid) values("' +
            presentid +
            '",' +
            "'" +
            baseInfo +
            "'" +
            ',"' +
            createTime +
            '",' +
            userid +
            ')'
        //console.log(sql)
        DBBase.query(sql, function(err, rows, fields) {
            if (err) {
                console.log(err)
                resolve(0)
            } else {
                //console.log(rows)
                //console.log(fields)
                resolve(rows.insertId)
            }
        })
    })
}
