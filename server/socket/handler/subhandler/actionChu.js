const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function chu(room, seat, action) {
	seat.chuPais.push(pai)
	seat.shouPais = utils.removePai(seat.shouPais, pai, 1)
	seat.shouPais.sort((a, b) => a - b)
	room.pendingType = Pending.PENDING_TYPE_NULL
	let hasAction = await otherChuUserAction(room, seat, action)
	await Publish.publishChuAction(room)
	if (!hasAction) {
		await Next.nextUser(room)
	} else {
		room.pendingType = Pending.PENDING_TYPE_CHU
	}
}

async function otherChuUserAction(room, seat, action) {
	room.seats.forEach(seatItem => {
		seat.actions = []
	})
	let hasAction = false
	room.seats.forEach((seatItem, index) => {
		if (index === room.index) {
			return
		}
		seatItem.actions = HXMJManager.getActions(
			seatItem.shouPais,
			seatItem.pengPais,
			Action.ACTION_CHU,
			action.pai,
			seatItem.que
		)
		hasAction = hasAction || seatItem.actions.length > 0
	})
	return hasAction
}

module.exports = chu
