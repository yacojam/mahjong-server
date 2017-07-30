const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const Action = require('../../../algorithm/HxmjRules/hxaction')

async function peng(room, seat, action) {
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	room.pendingType = Pending.PENDING_TYPE_NULL
	let pai = action.pai
	seat.pengPais.push(pai)
	seat.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
	seat.shouPais = utils.removePai(seat.shouPais, pai, 2)
	room.seats[room.index].chuPais.pop()
	room.index = room.seats.findIndex(u => u.userid === seat.userid)
	await Publish.publishPengAction(room, seat, pai)
	await Publish.sendActions(room, seat)
}

module.exports = peng
