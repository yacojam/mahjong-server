function getEmptySeat(i) {
    let seat = {}
    seat.userid = 0
    seat.index = i
    seat.username = null
    seat.headimg = null
    seat.sip = null
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
    seat.dissolved = false
    return seat
}

class Room {
    constructor(roomPresentId, createUid, rule, conf, qpsid) {
        this.roomPresentId = roomPresentId
        this.createUid = createUid
        this.rule = rule
        this.conf = conf
        this.qpsid = qpsid
        this.ruleType = 'hxdz'
        this.dealerIndex = 0
        this.seats = []
        for (var i = 0; i < 4; i++) {
            this.seats.push(getEmptySeat(i))
        }
        this.sign = ''
        this.result = []
        this.gameRecord = []
        this.state = 0
        this.index = -1
        this.leftPais = []
        this.pendingType = null
        this.currentJu = 0
        this.currentGame = 0
        this.isJuSameWithRoom = rule.numOfJu === 1
        this.dissolveId = null
        this.dissolveUid = null
        this.dissolved = false
    }

    getUserIndex(userid) {
        var index = -1
        for (var i = 0; i < this.seats.length; i++) {
            if (this.seats[i].userid == userid) {
                index = i
                break
            }
        }
        return index
    }

    getUserSeat(userid) {
        return this.seats[this.getUserIndex(userid)]
    }

    getEmptyIndex() {
        var index = -1
        for (var i = 0; i < this.seats.length; i++) {
            if (this.seats[i].userid == 0) {
                index = i
                break
            }
        }
        return index
    }

    isCreator(userid) {
        return this.createUid == userid
    }

    canStart() {
        let ret = true
        for (let seat of this.seats) {
            if (seat.userid == 0 || seat.index == -1 || !seat.ready) {
                ret = false
                break
            }
        }
        return ret
    }

    clearSeat(index) {
        this.seats[index] = getEmptySeat(index)
    }
}

module.exports = Room
