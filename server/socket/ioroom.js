const roomManager = require('../roomManager/roomManager')
const roomUtils = require('../roomManager/roomInfoUtils')
const Error = require('../routers/ServerError')
const connectionManager = require('./connectionManager')
const broadcast = require('./broadcast')
const userDao = require('../db/UserDao')
const Next = require('./handler/next')
const RoomState = Next.RoomState
const actionHandle = require('./handler/handler')

async function dissolveRoom(rpid) {
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
            socket.disconnect()
        }
    }
    roomManager.delRoom(rpid)
}

async function finishRoom(rpid) {
    var room = roomManager.getRoom(rpid)
    await.userDao.deleteCardNum(room.createUid, room.rule.numOfJu)
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
            socket.disconnect()
        }
    }
    roomManager.delRoom(rpid)

}

function bind(socket) {
    socket.on('user_join', async userData => {
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
            roomManager.setRidForUid(roomPresentId, userid)
        }
        connectionManager.bind(socket, userid)

        //返回数据给客户端
        ret = await Next.getRoomData(room, userid)
        console.log(ret)
        socket.emit('user_join_result', ret)

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
        //通知其他玩家有人退出房间
        broadcast.broadcastInRoom(
            'user_exit_room',
            { userid: userid },
            userid,
            false
        )

        index = roomUtils.getUserIndex(room, userid)
        room.seat[index] = { userid: 0, index: -1 }
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
        //非房主不能解散房间
        if (!roomUtils.isCreator(roomManager.getRoom(rpid), userid)) {
            return
        }
        //
        await dissolveRoom(rpid)
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
