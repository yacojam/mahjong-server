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

exports.updateRoomResult = function(roomid, roomresult) {
    let record = { roomresult }
    return DBBase.update('nv_rooms', record, `id='${roomid}'`)
}

exports.insertRecore = function(records) {
    return DBBase.insert('nv_games', records)
}

exports.getAllRoomsForUserId = function(userid) {
    return DBBase.selectAll(
        'nv_rooms',
        `userid0='${userid}' or userid1='${userid}' or userid2='${userid}' or userid3='${userid}'`
    ).then(rooms => {
        if (rooms == null) {
            return null
        } else {
            rooms = rooms.sort((a, b) => {
                return b.id - a.id
            })
            if (rooms.length > 15) {
                rooms = rooms.slice(0, 15)
            }
            return rooms
        }
    })
}

// async function test() {
//     let ret = await exports.getAllRoomsForUserId('100001')
//     console.log(JSON.stringify(ret))
// }

// test()
