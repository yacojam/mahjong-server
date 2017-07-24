const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function wangang(room, seat, action) {
	seat.gangPais.push(action.pai)
	seat.shouPais = utils.removePai(seat.shouPais, pai)
	room.pendingType = Pending.PENDING_TYPE_NULL
	let hasAction = await otherWgUserAction(room, seat, action)
	await Publish.publishWanGangAction(room, seat)
	if (!hasAction) {
		await Next.moAction(room, Action.ACTION_WGANG, true)
	} else {
		room.pendingType = Pending.PENDING_TYPE_WGANG
	}
}

async function otherWgUserAction(room, seat, action) {
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
			Action.ACTION_WGANG,
			action.pai,
			seatItem.que
		)
		hasAction = hasAction || seatItem.actions.length > 0
	})
	return hasAction
}

module.exports = wangang
