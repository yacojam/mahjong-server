const roomManager = require('../roomManager/roomManager')
const Error = require('../routers/ServerError')
const connectionManager = require('./connectionManager')
const broadcast = require('./broadcast')

function generateSeatInfo(roomInfo) {
    var seats = roomInfo.seats
        .filter(seat => {
            return seat.userid > 0 && seat.index >= 0
        })
        .map(seat => {
            let {
                userid,
                username,
                headimg,
                score,
                moMomey,
                sip,
                index,
                ready
            } = seat
            online = connectionManager.get(uid) != null
            return {
                userid,
                username,
                headimg,
                score,
                moMomey,
                sip,
                index,
                ready,
                online
            }
        })
}

function bind(socket) {
    socket.on('user_join', async (userData, fn) => {
        if (socket.userid != null) {
            return
        }
        var ret = {}
        var userid = userData.userid
        //检测房间数据
        var roomPresentId = userData.roomid
        var roomSign = userData.roomsign
        var roomInfo = roomManager.getRoom(roomPresentId)
        if (roomInfo == null || roomInfo.sign != roomSign) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        var index = roomInfo.getUserIndex(userid)
        //没找到对应的位置
        if (index == -1) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        //找到座位,根据seat.index == -1来判断是新加入还是重新连
        var isCreator = roomInfo.isCreator(userid)
        var seat = roomManager.seats[index]
        var isNewUser = seat.index === -1
        if (isNewUser) {
            seat.userid = userid
            seat.username = ''
            seat.headimg = ''
            seat.score = 50
            seat.moMoney = 0
            seat.sip = socket.handshake.address
            seat.online = true
            seat.ready = isCreator
            seat.index = index
            roomManager.setRidForUid(roomPresentId, userid)
        } else {
        }
        connectionManager.bind(socket, userid)

        //返回数据给客户端
        ret.success = true
        ret.data = {
            roomid: roomPresentId,
            conf: roomInfo.conf,
            seats: generateSeatInfo(roomInfo)
        }
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

    socket.on('user_reconnect', async (userData, fn) => {
        var userid = userData.userid
    })

    socket.on('user_exit', async userData => {})

    socket.on('dissolve_room', async userData => {})

    socket.on('user_ready', async userData => {})

    socket.on('disconnect', async () => {
        userid = socket.userid
        if (userid == null) {
            return
        }
        //通知其他玩家该玩家离线
        var data = { userid: userid, online: false }
        broadcast.broadcastInRoom('user_disconnect', data, userid, false)

        //清除该玩家的连接信息
        connectionManager.del(userid)
    })
}

modules.exports = bind
