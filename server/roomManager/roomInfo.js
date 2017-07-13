// roomInfo = {
//  roomId : 2001,//数据库Id
//     presentId : '172627',//6位展示Id
//     createUserId : 1000009,
//     ruleType : 'hxdz', //rule的类型，用于之后的扩展
//     difeng : ,//一局多少money
//     roomRule : //具体的rule对象
//     roomManager : //manager对象，根据ruleType来设置的
//     seats : [seat1, seat2, seat3, seat4], //每个房间4个位置，位置记录的信息随Type而定
//     dealerIndex : 0, //庄位
//     roomResult : []
// };

// Seat = {
//  userid : ,//用户id
//     score : , //用户当前积分

//     name : , //用户昵称
//     seatIndex : //座位index
//     moMoney : ,//自摸奖励
//     ready : true, //是否已准备
//     ip : ,//用户ip
//     online : true, //是否在线
// };
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
        this.result = [0, 0, 0, 0]
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
        return this.createUid === userid
    }
}

module.exports = roomInfo
