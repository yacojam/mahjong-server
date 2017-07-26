const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function wangang(room, seat, action) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	let pai = action.pai
	seat.gangPais.push(pai)
	seat.shouPais = utils.removePai(seat.shouPais, pai)
	seat.shouPais.sort((a, b) => a - b)
	await Publish.publishWanGangAction(room, seat, pai)
	await otherWgUserAction(room, seat, action)
}

async function otherWgUserAction(room, seat, action) {
	let hasAction = false
	room.seats.forEach((seatItem, index) => {
		if (index === room.index) {
			return
		}
		seatItem.actions = HXMJManager.getActions(
			seatItem.shouPais,
			seatItem.pengPais,
			Action.ACTION_WGANG,
			action.pai,
			seatItem.que
		)
		if (seatItem.actions.length > 0) {
			Publish.sendActions(room, seatItem)
		}
		hasAction = hasAction || seatItem.actions.length > 0
	})
	if (!hasAction) {
		await Next.moAction(room, Action.ACTION_GMO, true)
	} else {
		room.pendingType = Pending.PENDING_TYPE_WGANG
	}
}

module.exports = wangang
