const roomManager = require('../manager/roomManager/roomManager')
const connectionManager = require('../manager/connectionManager/connectionManager')
const qpsManager = require('../manager/qpsManager/qpsManager')
const QpsDao = require('../db/QpsDao')
const userDao = require('../db/UserDao')

function bind(socket) {
    socket.on('user_join_qps', async userData => {
        console.log('user_join_qps')
        if (socket.userid != null) {
            return
        }
        userData =
            typeof userData === 'string' ? JSON.parse(userData) : userData
        var ret = {}
        let { userid, qpsid } = userData
        let connectRet = await qpsManager.connectQps(userid, qpsid)
        if (connectRet.code == 1) {
            ret.code = 1
            ret.error = { code: -1, msg: '参数不对' }
            socket.emit('user_join_qps_result', ret)
            socket.disconnect()
            return
        }
        let qps = connectRet.data.qps
        ret.code = 0
        ret.data = getQpsData(qps)
        socket.emit('user_join_qps_result', ret)
        connectionManager.bind(socket, userid)
        broadcastInQps('qps_user_on', qps.getUser(userid), qps, userid, false)
    })

    socket.on('disconnect', async userData => {
        if (socket.userid == null) {
            return
        }
        disconnect(socket.userid)
    })

    socket.on('user_enter_room', async userData => {
        if (socket.userid != null) {
            return
        }
        let ret = {}
        userData =
            typeof userData === 'string' ? JSON.parse(userData) : userData
        let { rpid, qpsid } = userData
        let qps = qpsManager.getQps(qpsid)
        if (qps.users.every(u => u.userid != socket.userid)) {
            //参数不对
            ret.code = 1
            socket.emit('user_enter_room_result', ret)
            return
        }
        let room = roomManager.getRoom(rpid)
        if (room && room.qpsid && room.qpsid = qpsid) {
            let enterRet = await roomManager.preEnterRoom(socket.userid, rpid)
            if (enterRet.code != 0) {
                //房间满了
                ret.code = 2
                socket.emit('user_enter_room_result', ret)
                return
            } else {
                ret.code = 0
                ret.data = { rpid: room.roomPresentId, sign: room.sign }
                socket.emit('user_enter_room_result', ret)
                return
            }
        } else {
            ret.code = 1
            socket.emit('user_enter_room_result', ret)
            return
        }
    })
}

function getQpsData(qps) {
    let onlineUsers = qps.users.filter(u => u.onlineType == 1)
    let gameUsers = qps.users.filter(u => u.onlineType == 2)
    let allRooms = roomManager.getRoomsForQps(qps.qid)
    return {
        users: onlineUsers.concat(gameUsers),
        rooms: allRooms
    }
}

function disconnect(userid) {
    let ret = qpsManager.disconnectQps()
    broadcastInQps('qps_user_off', {}, ret.data.qps, userid, false)
    connectionManager.del(userid)
}

function broadcastInQps(msg, data, qps, userid, includeSelf) {
    qps.users.filter(u => u.onlineType == 1).forEach(u => {
        if (u.userid != userid || includeSelf) {
            connectionManager.sendMessage(u.userid, msg, data)
        }
    })
}

module.exports = bind