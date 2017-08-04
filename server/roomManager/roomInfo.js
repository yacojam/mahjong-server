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
            seat.username = null
            seat.headimg = null
            seat.sip = null
            seat.online = false
            seat.ready = false
            seat.isCreator = false

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
            seat.isJuSameWithRoom = rule.numOfJu === 1
            this.seats.push(seat)
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
    }
}

module.exports = roomInfo
