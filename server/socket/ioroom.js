const roomManager = require('../manager/roomManager/roomManager')
const connectionManager = require('../manager/connectionManager/connectionManager')
const qpsManager = require('../manager/qpsManager/qpsManager')
const Error = require('../routers/ServerError')
const userDao = require('../db/UserDao')
const Next = require('./handler/next')
const RoomState = Next.RoomState
const actionHandle = require('./handler/handler')

async function dissolveRoom(rpid) {
    //如果解散的是棋牌室房间
    let qpsid = roomManager.getRoom(rpid).qpsid
    let qps = null
    if (qpsid) {
        qps = qpsManager.getQps(room.qpsid)
    }
    let users = await roomManager.dissolveRoom(rpid)
    for (let userid of users) {
        if (qpsid) {
            let user = qps.getUser(userid)
            user.onlineType = 0
            broadcastInQps('qps_user_off', user, qps)
        }
        let socket = connectionManager.get(userid)
        if (socket != null) {
            socket.emit('room_dissoved', {})
            socket.disconnect()
            connectionManager.del(userid)
        }
    }
}

async function finishRoom(rpid) {
    //如果结束的是棋牌室房间
    let qpsid = roomManager.getRoom(rpid).qpsid
    let qps = null
    if (qpsid) {
        qps = qpsManager.getQps(room.qpsid)
    }
    let users = await roomManager.finishRoom(rpid)
    for (let userid of users) {
        if (qpsid) {
            let user = qps.getUser(userid)
            user.onlineType = 0
            broadcastInQps('qps_user_off', user, qps)
        }
        let socket = connectionManager.get(userid)
        if (socket != null) {
            socket.emit('room_finished', {})
            socket.disconnect()
            connectionManager.del(userid)
        }
    }
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
        let { userid, rpid, sign } = userData
        if (!roomManager.isMatched(rpid, sign)) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        let joinRet = await roomManager.joinRoom(userid, rpid)
        if (joinRet.code == 1) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        if (joinRet.code == 2) {
            ret.success = false
            ret.error = Error.RoomHasFullError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        let { room, isnew, emptyIndex } = joinRet.data
        if (isnew) {
            room.seats[emptyIndex].ready = room.isCreator(userid)
        }
        let seat = Object.assign({}, room.seats[emptyIndex])
        seat.online = true
        //返回数据给客户端
        ret = await Next.getRoomData(room, userid)
        if (
            (room.dissolveId != null && room.dissolveUid != null) ||
            room.dissolved
        ) {
            let dSeats = room.seats.filter(u => u.dissolved).map(u => u.userid)
            ret.data.dissolveData = {
                roomDissoved: room.dissolved,
                userid: room.dissolveUid,
                time: room.time,
                dissolved: seat.dissolved,
                dSeats
            }
        }
        console.log(ret)
        socket.emit('user_join_result', ret)
        if (room.state === RoomState.ROOMOVER || room.dissolved) {
            socket.disconnect()
            return
        }
        connectionManager.bind(socket, userid)
        //通知其他客户端
        let msg = isnew ? 'new_user_come' : 'user_state_changed'
        let data = isnew ? seat : { userid: userid, online: true }
        broadcastInRoom(msg, data, userid, false)

        //如果进入的是棋牌室房间
        if (isnew && room.qpsid) {
            let qps = qpsManager.getQps(room.qpsid)
            let user = qps.getUser(userid)
            user.onlineType = 2
            broadcastInQps('qps_user_game', user, qps)
            broadcastInQps('qps_user_join_room', { user, rpid }, qps)
        }
    })

    socket.on('user_exit', async userData => {
        var userid = socket.userid
        if (userid == null) {
            return
        }
        let ret = await roomManager.exitRoom(userid)
        if (ret.code == 1) {
            return
        }
        //牌局已经开始，建议走申请牌局解散
        if (ret.code == 2) {
            return
        }
        //通知其他玩家有人退出房间
        broadcastWithRoom('user_exit_room', { userid }, ret.room, userid, false)
        connectionManager.del(userid)
        socket.emit('exit_success', {})
        socket.disconnect()

        //退出的是棋牌室房间
        if (ret.room.qpsid) {
            let qps = qpsManager.getQps(ret.room.qpsid)
            let user = qps.getUser(userid)
            user.onlineType = 0
            broadcastInQps('qps_user_off', user, qps)
            broadcastInQps(
                'qps_user_exit_room',
                { user, rpid: ret.room.roomPresentId },
                qps
            )
        }
    })

    //解散房间
    socket.on('user_dissolve', async userData => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        //非房主不能解散房间
        if (!room || !room.isCreator(userid)) {
            return
        }
        //牌局已经开始，建议走申请牌局解散
        if (room.state != 0) {
            return
        }
        await dissolveRoom(room.roomPresentId)
    })

    socket.on('dissolve_request', async userData => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        //已经有人在解散房间了
        if (!room || room.dissolveId) {
            return
        }
        room.dissolveId = setTimeout(() => {
            if (room.dissolveId) {
                room.dissolveId = null
                room.dissolveUid = null
                clearInterval(room.dissolveTimeId)
                room.dissolveTimeId = null
                dissolveRoom(room.roomPresentId)
            }
        }, 61000)
        room.time = 61
        room.dissolveTimeId = setInterval(() => {
            room.time = room.time - 1
            if (room.time == 0) {
                clearInterval(room.dissolveTimeId)
            }
        }, 1000)
        room.dissolveUid = userid
        room.getUserSeat(userid).dissolved = true
        broadcastInRoom('dissolve_request_push', { userid }, userid, true)
    })

    socket.on('dissolve_request_agree', async userData => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        //房间已经解散了
        if (!room || room.dissolveId == null) {
            return
        }
        let seat = room.getUserSeat(userid)
        if (!seat.dissolved) {
            seat.dissolved = true
            socket.emit('dissolve_agree_send_success', {})
            broadcastInRoom(
                'dissolve_request_agree_push',
                { userid },
                userid,
                true
            )
            let dissolved = room.seats.every(s => s.dissolved)
            if (dissolved) {
                clearTimeout(room.dissolveId)
                room.dissolveId = null
                room.dissolveUid = null
                await dissolveRoom(room.roomPresentId)
            }
        }
    })

    socket.on('dissolve_request_reject', async userData => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        //房间已经解散了
        if (!room || room.dissolveId == null) {
            return
        }
        let seat = room.getUserSeat(userid)
        if (seat.dissolved) {
            return
        }
        clearTimeout(room.dissolveId)
        clearInterval(room.dissolveTimeId)
        room.dissolveId = null
        room.dissolveUid = null
        room.dissolveTimeId = null
        room.seats.forEach(s => (s.dissolved = false))
        broadcastInRoom('dissolve_request_failed', { userid }, userid, true)
    })

    socket.on('user_ready', async userData => {
        let userid = socket.userid
        console.log('user ' + userid + 'send ready info')
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        if (room == null) {
            return
        }
        let index = room.getUserIndex(userid)
        if (index == -1) {
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
        broadcastInRoom('user_state_changed', data, userid, true)
        //game start
        if (room.canStart()) {
            if (room.qpsid && !continued) {
                qps = qpsManager.getQps(room.qpsid)
                if (qps) {
                    broadcastInQps(
                        'qps_room_start',
                        { rpid: room.roomPresentId },
                        qps
                    )
                    await qpsManager.createRoomForQps(qps)
                }
            }
            await Next.startRoom(room)
        }
    })

    socket.on('action', async action => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let room = roomManager.getRoomForUserId(userid)
        if (room == null) {
            return
        }
        let seat = room.seats.find(s => s.userid == userid)
        action = typeof action === 'string' ? JSON.parse(action) : action
        await actionHandle(room, seat, action)
        if (room.state === RoomState.ROOMOVER) {
            await finishRoom(room.roomPresentId)
        }
    })

    socket.on('voice_msg', data => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        msgData = typeof data === 'string' ? JSON.parse(data) : data
        let { msg, time } = msgData
        broadcastInRoom('voice_data', { msg, time, userid }, userid, true)
    })

    socket.on('quick_chat', data => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        msgData = typeof data === 'string' ? JSON.parse(data) : data
        let index = msgData.index
        broadcastInRoom('quick_chat_data', { index, userid }, userid, true)
    })

    socket.on('emoji', data => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        msgData = typeof data === 'string' ? JSON.parse(data) : data
        let name = msgData.name
        broadcastInRoom('emoji_data', { name, userid }, userid, true)
    })

    socket.on('chat', data => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        msgData = typeof data === 'string' ? JSON.parse(data) : data
        let content = msgData.content
        broadcastInRoom('chat_data', { content, userid }, userid, true)
    })

    socket.on('game_ping', () => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        socket.emit('game_pong', {})
    })

    socket.on('disconnect', async () => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        //通知其他玩家该玩家离线
        let data = { userid: userid, online: false }
        broadcastInRoom('user_state_changed', data, userid, false)
        //清除该玩家的连接信息
        connectionManager.del(userid)
    })
}

function broadcastInRoom(message, data, userid, includedSender) {
    let room = roomManager.getRoomForUserId(userid)
    broadcastWithRoom(message, data, room, userid, includedSender)
}

function broadcastWithRoom(message, data, room, userid, includedSender) {
    if (room) {
        for (var i = 0; i < 4; i++) {
            if (room.seats[i].userid > 0) {
                if (room.seats[i].userid == userid && !includedSender) {
                    continue
                }
                connectionManager.sendMessage(
                    room.seats[i].userid,
                    message,
                    data
                )
            }
        }
    }
}

function broadcastInQps(msg, data, qps) {
    qps.users.filter(u => u.onlineType == 1).forEach(u => {
        connectionManager.sendMessage(u.userid, msg, data)
    })
}

module.exports = bind
