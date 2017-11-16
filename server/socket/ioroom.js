const roomManager = require('../roomManager/roomManager')
const roomUtils = require('../roomManager/roomInfoUtils')
const Error = require('../routers/ServerError')
const connectionManager = require('./connectionManager')
const broadcast = require('./broadcast')
const userDao = require('../db/UserDao')
const Next = require('./handler/next')
const RoomState = Next.RoomState
const actionHandle = require('./handler/handler')

async function dissolveRoom(rpid, addCard = true) {
    var room = roomManager.getRoom(rpid)
    for (let seat of room.seats) {
        if (seat.userid > 0) {
            let socket = connectionManager.get(seat.userid)
            if (socket != null) {
                socket.emit('room_dissoved', {})
            }
            roomManager.delUid(seat.userid)
            connectionManager.del(seat.userid)
            //更新数据库信息, 加await
            await userDao.updateRoomID(seat.userid, '')
            if (socket != null) {
                socket.disconnect()
            }
        }
    }
    roomManager.delRoom(rpid)
    if (addCard) {
        await userDao.addCardNum(room.createUid, room.rule.numOfJu)
    }
}

async function finishRoom(rpid) {
    var room = roomManager.getRoom(rpid)
    for (let seat of room.seats) {
        if (seat.userid > 0) {
            let socket = connectionManager.get(seat.userid)
            if (socket != null) {
                socket.emit('room_finished', {})
            }
            roomManager.delUid(seat.userid)
            connectionManager.del(seat.userid)
            //更新数据库信息, 加await
            await userDao.updateRoomID(seat.userid, '')
            if (socket != null) {
                socket.disconnect()
            }
        }
    }
    setTimeout(() => {
        roomManager.delRoom(rpid)
    }, 600000)
}

function bind(socket) {
    socket.on('user_join', async userData => {
        console.log('user_join')
        if (socket.userid != null) {
            return
        }
        userData =
            typeof userData === 'string' ? JSON.parse(userData) : userData

        var ret = {}
        var userid = userData.userid
        //检测房间数据
        var roomPresentId = userData.rpid
        var roomSign = userData.sign
        var room = roomManager.getRoom(roomPresentId)
        if (room == null || room.sign != roomSign) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }

        var index = roomUtils.getUserIndex(room, userid)
        //没找到对应的位置
        if (index == -1) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        //找到座位,根据seat.index == -1来判断是新加入还是重新连
        var isCreator = roomUtils.isCreator(room, userid)
        var seat = room.seats[index]
        var isNewUser = seat.index === -1
        if (isNewUser) {
            let dbData = await userDao.getUserDataByUserid(userid)
            seat.userid = userid
            seat.username = dbData.name
            seat.headimg = dbData.headimg
            seat.sip = socket.handshake.address
            seat.online = true
            seat.ready = isCreator
            seat.index = index
            seat.isCreator = isCreator
            seat.sex = dbData.sex
            roomManager.setRidForUid(roomPresentId, userid)
        } else {
            seat.online = true
        }

        //返回数据给客户端
        ret = await Next.getRoomData(room, userid)
        if (room.dissolveId != null && room.dissolveUid != null) {
            ret.data.dissolveData = {
                userid,
                time: 60000,
                dissolved: seat.dissolved
            }
        }
        console.log(ret)
        socket.emit('user_join_result', ret)
        if (room.state === RoomState.ROOMOVER) {
            socket.disconnect()
            return
        }

        connectionManager.bind(socket, userid)
        //通知其他客户端
        if (isNewUser) {
            broadcast.broadcastInRoom('new_user_come', seat, userid, false)
        } else {
            broadcast.broadcastInRoom(
                'user_state_changed',
                { userid: userid, online: true },
                userid,
                false
            )
        }
    })

    socket.on('user_exit', async userData => {
        userData =
            typeof userData === 'string' ? JSON.parse(userData) : userData

        var userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        var rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        var room = roomManager.getRoom(rpid)
        if (roomUtils.isCreator(room, userid)) {
            return
        }
        //牌局已经开始，建议走申请牌局解散
        if (room.state != 0) {
            socket.emit('want_dissolve')
            return
        }

        //通知其他玩家有人退出房间
        broadcast.broadcastInRoom(
            'user_exit_room',
            { userid: userid },
            userid,
            false
        )

        index = roomUtils.getUserIndex(room, userid)
        roomUtils.clearSeat(room, index)
        //更新数据库用户信息,加await
        await userDao.updateRoomID(userid, '')
        //清除信息
        roomManager.delUid(userid)
        connectionManager.del(userid)
        socket.emit('exit_success')
        socket.disconnect()
    })

    //解散房间
    socket.on('user_dissolve', async userData => {
        let userid = socket.userid
        userData =
            typeof userData === 'string' ? JSON.parse(userData) : userData
        if (userid == null || userid !== userData.userid) {
            return
        }

        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        var room = roomManager.getRoom(rpid)
        //非房主不能解散房间
        if (!roomUtils.isCreator(room, userid)) {
            return
        }
        //牌局已经开始，建议走申请牌局解散
        if (room.state != 0) {
            socket.emit('want_dissolve')
            return
        }
        //
        await dissolveRoom(rpid)
    })

    socket.on('dissolve_request', async userData => {
        let userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        let room = roomManager.getRoom(rpid)
        //已经有人在解散房间了
        if (room.dissolveId != null) {
            return
        }
        room.dissolveId = setTimeout(() => {
            if (room.dissolveId) {
                room.dissolveId = null
                room.dissolveUid = null
                dissolveRoom(rpid, false)
            }
        }, 62000)
        room.dissolveUid = userid
        roomUtils.getUserSeat(room, userid).dissolved = true
        broadcast.broadcastInRoom(
            'dissolve_request_push',
            { userid, time: 60000 },
            userid,
            true
        )
    })

    socket.on('dissolve_request_agree', async userData => {
        let userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        let room = roomManager.getRoom(rpid)
        //房间已经解散了
        if (room.dissolveId == null) {
            return
        }
        let seat = roomUtils.getUserSeat(room, userid)
        if (!seat.dissolved) {
            seat.dissolved = true
            socket.emit('dissolve_agree_send_success')
            let dissolved = room.seats.every(s => s.dissolved)
            if (dissolved) {
                room.dissolveId = null
                room.dissolveUid = null
                clearTimeout(room.dissolveId)
                await dissolveRoom(rpid, false)
            }
        }
    })

    socket.on('dissolve_request_reject', async userData => {
        let userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        let room = roomManager.getRoom(rpid)
        //房间已经解散了
        if (room.dissolveId == null) {
            return
        }
        let seat = roomUtils.getUserSeat(room, userid)
        if (seat.dissolved) {
            return
        }
        clearTimeout(room.dissolveId)
        room.dissolveId = null
        room.dissolveUid = null
        room.seats.forEach(s => (s.dissolved = false))
        broadcast.broadcastInRoom(
            'dissolve_request_failed',
            { userid, time: 30000 },
            userid,
            false
        )
    })

    socket.on('user_ready', async userData => {
        let userid = socket.userid
        console.log('user ' + userid + 'send ready info')
        if (userid == null) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }

        let room = roomManager.getRoom(rpid)
        let index = roomUtils.getUserIndex(room, userid)
        if (index == -1 && room.seats[index].index == -1) {
            return
        }
        room.seats[index].ready = true
        let continued = false
        if (
            room.state === RoomState.GAMEOVER ||
            room.state === RoomState.JUOVER
        ) {
            continued = true
        }
        let data = { userid: userid, ready: true, continued }
        broadcast.broadcastInRoom('user_state_changed', data, userid, true)

        //game start
        if (roomUtils.canStart(room)) {
            await Next.startRoom(room)
        }
    })

    socket.on('action', async action => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        let room = roomManager.getRoom(rpid)
        let seat = room.seats.find(s => s.userid === userid)

        action = typeof action === 'string' ? JSON.parse(action) : action
        await actionHandle(room, seat, action)
        if (room.state === RoomState.ROOMOVER) {
            await finishRoom(rpid)
        }
    })

    socket.on('voice_msg', data => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        msgData = typeof data === 'string' ? JSON.parse(data) : data
        let { msg, time } = msgData
        broadcast.broadcastInRoom(
            'voice_data',
            { msg, time, userid },
            userid,
            true
        )
    })

    socket.on('game_ping', () => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        socket.emit('game_pong')
    })

    socket.on('disconnect', async () => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        //通知其他玩家该玩家离线
        let data = { userid: userid, online: false }
        broadcast.broadcastInRoom('user_state_changed', data, userid, false)

        //清除该玩家的连接信息
        connectionManager.del(userid)
    })
}

module.exports = bind
