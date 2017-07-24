const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function peng(room, seat, action) {
	seat.pengPais.push(action.pai)
	seat.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
	seat.shouPais = utils.removePai(seat.shouPais, pai, 2)
	room.seats[room.index].chuPais.pop()
	room.index = room.seats.findIndex(u => u.userid === seat.uid)
	room.pendingType = Pending.PENDING_TYPE_NULL
	await Publish.publishPengAction(room, seat)
}

module.exports = peng
