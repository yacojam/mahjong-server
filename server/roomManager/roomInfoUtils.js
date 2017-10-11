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

module.exports = {
    getUserIndex,
    getEmptyIndex,
    isCreator,
    canStart
}
