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

exports.updateUsers = function(roomid, userids) {
    let record = {
        userid0: userids[0],
        userid1: userids[1],
        userid2: userids[2],
        userid3: userids[3]
    }
    return DBBase.update('nv_rooms', record, `id='${roomid}'`)
}

exports.insertRecore = function(records) {
    return DBBase.insert('nv_games', records)
}
