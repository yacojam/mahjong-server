const roomManager = require('../roomManager/roomManager')
const Error = require('../routers/ServerError')
const connectionManager = require('./connectionManager')
const broadcast = require('./broadcast')
const userDao = require('../db/UserDao')

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
            online = connectionManager.get(userid) != null
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
    return seats
}

async function dissolveRoom(rpid) {
    var roomInfo = roomManager[rpid]
    for (let seat of roomInfo.seats) {
        if (seat.userid > 0) {
            let socket = connectionManager.get(seat.userid)
            if (socket != null) {
                socket.emit('room_dissoved', {})
            }
            roomManager.delUid(seat.userid)
            roomManager.delRoom(rpid)
            connectionManager.del(seat.userid)
            //更新数据库信息, 加await
            await userDao.sycn_update_roomid_of_userid('', seat.userid)
            socket.disconnect()
        }
    }
}

function bind(socket) {
    socket.on('user_join', async userData => {
        if (socket.userid != null) {
            return
        }
        var ret = {}
        var userid = userData.userid
        //检测房间数据
        console.log(userData)
        var roomPresentId = userData.rpid
        var roomSign = userData.sign
        var roomInfo = roomManager.getRoom(roomPresentId)
        console.log(roomInfo)
        if (roomInfo == null || roomInfo.sign != roomSign) {
            console.log('aaaa')
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        var index = roomInfo.getUserIndex(userid)
        //没找到对应的位置
        if (index == -1) {
            console.log('bbbb')
            ret.success = false
            ret.error = Error.ParamsNotVavidError
            socket.emit('user_join_result', ret)
            socket.disconnect()
            return
        }
        //找到座位,根据seat.index == -1来判断是新加入还是重新连
        var isCreator = roomInfo.isCreator(userid)
        var seat = roomInfo.seats[index]
        var isNewUser = seat.index === -1
        if (isNewUser) {
            let dbData = await userDao.sync_get_account_info_by_userid(userid)
            seat.userid = userid
            seat.username = dbData.name
            seat.headimg = dbData.headimg
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
            roomId: roomPresentId,
            dealerIndex: roomInfo.dealerIndex,
            isCreator: isCreator,
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

    socket.on('user_exit', async userData => {
        var userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        var rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        var roomInfo = roomManager.getRoom(rpid)
        if (roomInfo.isCreator(userid)) {
            return
        }
        //通知其他玩家有人退出房间
        broadcast.broadcastInRoom(
            'user_exit_room',
            { userid: userid },
            userid,
            false
        )

        index = roomInfo.getUserIndex(userid)
        roomInfo.seat[index] = { userid: 0, index: -1 }
        //更新数据库用户信息,加await
        await userDao.sycn_update_roomid_of_userid('', userid)
        //清除信息
        roomManager.delUid(userid)
        connectionManager.del(userid)
        socket.emit('exit_success')
        socket.disconnect()
    })

    //解散房间
    socket.on('user_dissolve', async userData => {
        let userid = socket.userid
        if (userid == null || userid !== userData.userid) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }
        //非房主不能解散房间
        if (!roomManager.getRoom(rpid).isCreator(userid)) {
            return
        }
        //
        await dissolveRoom(rpid)
    })

    socket.on('user_ready', async userData => {
        let userid = socket.userid
        if (userid == null) {
            return
        }
        let rpid = roomManager.getRidForUid(userid)
        if (rpid == null) {
            return
        }

        let roomInfo = roomManager.getRoom(rpid)
        let index = roomInfo.getUserIndex(userid)
        if (index == -1 && roomInfo.seats[index].index == -1) {
            return
        }
        roomInfo.seats[index].ready = true
        socket.emit('ready_success')
        let data = { userid: userid, ready: true }
        broadcast.broadcastInRoom('user_state_changed', data, userid, false)
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
