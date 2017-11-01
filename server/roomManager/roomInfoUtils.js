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
    return room.createUid == userid
}

function canStart(room) {
    let ret = true
    for (let seat of room.seats) {
        if (seat.userid == 0 || seat.index == -1 || !seat.ready) {
            ret = false
            break
        }
    }
    return ret
}

function clearSeat(room, index) {
    let seat = {}
    seat.userid = 0
    seat.index = -1
    seat.username = null
    seat.headimg = null
    seat.sip = null
    seat.online = false
    seat.ready = false
    seat.isCreator = false
    seat.sex = 1

    //game info
    seat.score = 0
    seat.moMoney = 0
    seat.shouPais = []
    seat.chuPais = []
    seat.pengPais = []
    seat.gangPais = []
    seat.anGangPais = []
    seat.que = 0
    seat.pendingAction = null
    seat.actions = []

    //result info
    seat.gameResult = null
    seat.juResult = null
    seat.roomResult = null
    room.seats[index] = seat
}

module.exports = {
    getUserIndex,
    getEmptyIndex,
    isCreator,
    canStart,
    clearSeat
}
