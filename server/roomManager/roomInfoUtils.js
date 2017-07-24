const RoomState = {
    READY: 0,
    START: 1,
    READYAGAIN: 2
}

const HXMJManager = require('../algorithm/HxmjRules/HxmjManager')
const Action = require('../algorithm/HxmjRules/hxaction')
const Pending = require('../algorithm/HxmjRules/pendingtype')

function getUserIndex(room, userid) {
    var index = -1
    for (var i = 0; i < room.seats.length; i++) {
        if (room.seats[i].userid == userid) {
            index = i
            break
        }
    }
    return index
}

function getEmptyIndex(room) {
    var index = -1
    for (var i = 0; i < room.seats.length; i++) {
        if (room.seats[i].userid == 0) {
            index = i
            break
        }
    }
    return index
}

function isCreator(room, userid) {
    return room.createUid === userid
}

function canStart(room) {
    let ret = true
    for (let seat of room.seats) {
        if (seat.userid == 0 || seat.index == -1 || !seat.ready) {
            ret = false
            break
        }
    }
    return false
}

function start(room) {
    let pais = HXMJManager.getRandomPais()
    let shouPais = HXMJManager.getUserPais(pais)
    let startIndex = room.dealerIndex
    for (var i = 0; i < 4; i++) {
        let index = (startIndex + i) % 4
        room.seats[index].shouPais = shouPais[i]
        room.seats[index].actions = [
            Action.makeupAction(Action.ACTION_DINGQUE, 0)
        ]
    }
    room.index = startIndex
    room.pendingType = Pending.PENDING_TYPE_QUE
}

module.exports = {
    getUserIndex,
    getEmptyIndex,
    isCreator,
    canStart
}
