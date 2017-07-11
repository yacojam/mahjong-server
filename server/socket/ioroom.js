const roomManager = require('../roomManager/roomManager')
const Error = require('../routers/ServerError')

function bind(socket) {
    socket.on('user_join', async (userData, fn) => {
        var ret = {}
        var userid = userData.userid
        var roomPresentId = userData.roomid
        var roomInfo = roomManager.getRoom(roomPresentId)
        var index = roomInfo.getUserIndex(userid)
        //没找到对应的位置
        if (index == -1) {
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            return
        }
        //找到座位
        var seat = roomManager.seats[index]
        seat.userid = userid
        seat.score = 50
        seat.moMoney = 0
        seat.ready = false
        seat.sip = socket.handshake.address
        seat.online = true

        //返回数据给客户端
        ret.success = true
        ret.roomInfo = roomInfo
        socket.emit('user_join_result', ret)
    })

    socket.on('user_reconnect', async (userData, fn) => {
        var userid = userData.userid
    })

    socket.on('user_exit', async userData => {})
}

modules.exports = bind
