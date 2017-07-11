const roomManager = require('../roomManager/roomManager')
const Error = require('../routers/ServerError')
const connectionManager = require('./connectionManager')
const broadcast = require('./broadcast')

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
        //找到座位
        var isCreator = roomInfo.isCreator(userid)
        var seat = roomManager.seats[index]
        seat.userid = userid
        seat.score = 50
        seat.moMoney = 0
        seat.sip = socket.handshake.address
        seat.online = true
        seat.ready = isCreator

        if (isCreator) {
            roomInfo.dealerIndex = index
        }

        connectionManager.bind(socket, userid)
        roomManager.setRidForUid(roomPresentId, userid)

        //返回数据给客户端
        ret.success = true
        ret.roomInfo = roomInfo
        socket.emit('user_join_result', ret)
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
