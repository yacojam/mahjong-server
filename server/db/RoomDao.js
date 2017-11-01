const DBBase = require('./DBBase')

/** 创建房间, 返回房间的id **/
exports.createRoom = function(createuserid, presentid, createtime, baseinfo) {
    return DBBase.insert('nv_rooms', {
        presentid,
        baseinfo,
        createtime,
        createuserid
    })
        .then(ret => {
            return ret.results.insertId
        })
        .catch(e => {
            return 0
        })
}
