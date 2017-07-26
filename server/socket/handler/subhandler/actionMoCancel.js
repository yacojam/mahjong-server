const Pending = require('../../../algorithm/HxmjRules/pendingtype')
const Publish = require('../../dataflow/publish')
const Action = require('../../../algorithm/HxmjRules/hxaction')

async function moCancel(room, seat, action) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.seats.forEach(seatItem => {
		seatItem.actions = []
		seatItem.pendingAction = null
	})
	seat.actions = [Action.makeupAction(Action.ACTION_CHU, 0)]
	await Publish.sendActions(room, seat)
}

module.exports = moCancel
