class roomInfo {
    constructor(roomId, roomPresentId, createUid, rule, conf) {
        this.roomId = roomId
        this.roomPresentId = roomPresentId
        this.createUid = createUid
        this.rule = rule
        this.conf = conf
        this.ruleType = 'hxdz'
        this.dealerIndex = 0
        this.seats = []
        for (var i = 0; i < 4; i++) {
            var seat = {}
            seat.userid = 0
            seat.index = -1
            this.seats.push(seat)
        }
        this.sign = ''
        this.result = []
        this.gameRecord = []
        this.state = 0
        this.index = 0
        this.leftPais = []
        this.pendingType = null
        this.currentJu = 0
        this.currentGame = 0
    }
}

module.exports = roomInfo
