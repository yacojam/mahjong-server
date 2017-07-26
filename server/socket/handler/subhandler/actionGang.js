const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function gang(room, seat, action, anGang = false) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	let pai = action.pai
	if (anGang) {
		seat.shouPais = utils.removePai(seat.shouPais, pai, 4)
		seat.anGangPais.push(pai)
		seat.pengPais.push(pai)
		seat.gangPais.push(pai)
	} else {
		seat.shouPais = utils.removePai(seat.shouPais, pai, 3)
		seat.pengPais.push(pai)
		seat.gangPais.push(pai)
		room.users[room.index].chuPais.pop()
	}
	room.index = room.seats.findIndex(u => u.userid === seat.userid)
	if (anGang) {
		await Publish.publishAnGangAction(room, seat)
	} else {
		await Publish.publishPGangAction(room, seat)
	}
	await Next.moAction(room, Action.ACTION_GMO, true)
}

module.exports = gang
