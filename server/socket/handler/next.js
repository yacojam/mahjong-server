const HXMJManager = require('../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../algorithm/HxmjRules/hxaction')
const Publish = require('../dataflow/publish')
const Pending = require('../../algorithm/HxmjRules/pendingtype')

async function moAction(room, pAction, gang = false) {
	let user = room.seats[room.index]
	let moPai = gang ? room.leftPais.shift() : room.leftPais.pop()
	let actions = HXMJManager.getActions(
		user.shouPais,
		user.pengPais,
		pAction,
		moPai,
		user.que
	)
	if (actions.length === 0) {
		actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
	} else {
		room.pendingType = Pending.PENDING_TYPE_MO
	}
	user.actions = actions
	user.shouPais.push(moPai)
	await Publish.publishMoAction(room, seat)
}

async function startAction(room) {
	let seat = room.seats[room.index]
	let copyShouPais = seat.shouPais.concat()
	let moPai = copyShouPais.pop()
	let actions = HXMJManager.getActions(
		copyShouPais,
		[],
		Action.ACTION_MO,
		moPai,
		seat.que
	)
	if (actions.length === 0) {
		actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
	} else {
		room.pendingType = Pending.PENDING_TYPE_MO
	}
	seat.actions = actions
}

async function nextUser(room) {
	const index = (room.index + 1) % room.users.length
	room.index = index
	await moAction(room, Action.ACTION_MO)
	return room
}

async function endGame(room, seat, scores, isHu = true) {
	//liuju
	if (!isHu) {
	} else {
		seat.moMoney = 3 * scores[1] * room.rule.dfOfJu / 5
		let isOver = false
		room.seats.forEach(s => {
			if (s.score > score[0]) {
				seat.score += score[0]
				s.score -= score[0]
			} else {
				seat.score += s.score
				s.score = 0
				isOver = true
			}
			s.moMoney -= scores[1] * room.rule.dfOfJu / 5
		})

		if (isOver) {
		}
	}
}
