const utils = require('../../../algorithm/room/utils')
const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const HXMJManager = require('../../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../../algorithm/HxmjRules/hxaction')
const Next = require('../next')

async function chu(room, seat, action) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	let pai = action.pai
	seat.chuPais.push(pai)
	seat.shouPais = utils.removePai(seat.shouPais, pai, 1)
	seat.shouPais.sort((a, b) => a - b)
	await Publish.publishChuAction(room, seat, pai)
	await otherChuUserAction(room, seat, action)
}

async function otherChuUserAction(room, seat, action) {
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
			seatItem.que,
			room.leftPais.length
		)
		if (seatItem.actions.length > 0) {
			Publish.sendActions(room, seatItem)
		}
		hasAction = hasAction || seatItem.actions.length > 0
	})
	if (!hasAction) {
		await Next.nextUser(room)
	} else {
		room.pendingType = Pending.PENDING_TYPE_CHU
	}
}

module.exports = chu
