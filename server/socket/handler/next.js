const HXMJManager = require('../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../algorithm/HxmjRules/hxaction')
const Publish = require('../dataflow/publish')
const Pending = require('../../algorithm/HxmjRules/pendingtype')
const connectionManager = require('../connectionManager')

const RoomState = {
	READY: 0,
	PLAY: 1,
	GAMEOVER: 2,
	JUOVER: 3,
	ROOMOVER: 4
}

async function getRoomData(room, uid) {
	let ret = {}
	let {
		state,
		conf,
		seats,
		dealerIndex,
		index,
		leftPais,
		currentJu,
		currentGame
	} = room
	if (room.state === RoomState.READY) {
		let seatsData = seats
			.filter(seat => seat.userid > 0 && seat.index >= 0)
			.map(seat => {
				let { userid, username, headimg, sip, index, ready } = seat
				let online = connectionManager.get(userid) != null
				let isCreator = seat.isCreator
				return {
					userid,
					username,
					headimg,
					sip,
					index,
					ready,
					online,
					isCreator
				}
			})
		ret.success = true
		ret.data = {
			state,
			conf,
			seats: seatsData
		}
		return ret
	}

	let seatsData = seats
		.filter(seat => {
			return seat.userid > 0 && seat.index >= 0
		})
		.map(seat => {
			let { userid, username, headimg, sip, index, ready } = seat
			let { shouPais, chuPais, pengPais, gangPais, anGangPais } = seat
			let { score, moMoney, que, pendingAction, actions } = seat
			let online = connectionManager.get(userid) != null
			let isCreator = seat.isCreator
			let shouPaisNum = seat.shouPais.length
			if (userid !== uid && state === RoomState.PLAY) {
				shouPais = []
				actions = []
				pendingAction = null
			}
			return {
				userid,
				username,
				headimg,
				score,
				moMoney,
				sip,
				index,
				ready,
				isCreator,
				shouPais,
				chuPais,
				pengPais,
				gangPais,
				anGangPais,
				que,
				online,
				shouPaisNum,
				actions,
				pendingAction
			}
		})
	ret.success = true
	ret.data = {
		state,
		conf,
		dealerIndex,
		leftNum: leftPais.length,
		index,
		currentJu,
		currentGame,
		seats: seatsData
	}
	return ret
}

async function start(room, isRoom, isJu, isGame) {
	room.state = RoomState.PLAY
	let pais = HXMJManager.getRandomPais()
	let shouPais = HXMJManager.getUserPais(pais)
	let startIndex = room.dealerIndex
	for (var i = 0; i < 4; i++) {
		let index = (startIndex + i) % 4
		let seat = room.seats[index]
		seat.shouPais = shouPais[i]
		seat.chuPais = []
		seat.pengPais = []
		seat.gangPais = []
		seat.anGangPais = []
		if (!isGame) {
			seat.score = 50
			seat.moMoney = 0
		}
		seat.que = 0
		seat.pendingAction = null
		seat.actions = [Action.makeupAction(Action.ACTION_DINGQUE, 0)]
	}
	if (isRoom) {
		room.currentJu = 1
		room.currentGame = 1
	}
	if (isJu) {
		room.currentJu++
		room.currentGame = 1
	}
	if (isGame) {
		room.currentGame++
	}
	room.leftPais = pais
	room.index = startIndex
	await Publish.publishGameStart(room)
	room.pendingType = Pending.PENDING_TYPE_QUE
	await Publish.publishDingQue(room)
}

async function startRoom(room) {
	await start(room, true, false, false)
}

async function startGame(room) {
	await start(room, false, false, true)
}

async function startJu(room) {
	await start(room, false, true, false)
}

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
	await Publish.publishMoAction(room, seat, moPai)
	await Publish.sendActions(room, seat)
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
		room.pendingType = Pending.PENDING_TYPE_NULL
	} else {
		room.pendingType = Pending.PENDING_TYPE_MO
	}
	seat.actions = actions
	await Publish.sendActions(room, seat)
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
		room.state = RoomState.GAMEOVER
	} else {
		seat.moMoney = 3 * scores[1] * room.rule.dfOfJu / 5
		let isOver = false
		let isNa = true
		room.seats.forEach(s => {
			if (s.userid !== seat.userid) {
				if (s.score > score[0]) {
					seat.score += score[0]
					s.score -= score[0]
					isNa = false
				} else {
					seat.score += s.score
					s.score = 0
					isOver = true
				}
				s.moMoney -= scores[1] * room.rule.dfOfJu / 5
			}
		})

		if (isOver) {
			let JuRet = room.seats.map(s => {
				let { userid, index, score, moMoney } = s
				let isScoreWin = score - 50 > 0
				let scoreMoney = Math.round(
					Math.abs(score - 50) * room.rule.dfOfJu / 50.0
				)
				if (!isScoreWin) {
					scoreMoney = 0 - scoreMoney
				}
				let naMoney = 0
				if (isNa) {
					if (room.currentGame == 1) {
						if (s.userid === seat.userid) {
							naMoney = dfOfJu * 3
						} else {
							naMoney = 0 - dfOfJu
						}
					} else {
						if (s.userid === seat.userid) {
							naMoney = dfOfJu * 3 / 5 * 3
						} else {
							naMoney = 0 - dfOfJu * 3 / 5
						}
					}
				}
				return { userid, index, score, moMoney, scoreMoney, naMoney }
			})
			room.result.push(JuRet)
			if (room.currentJu === room.rule.numOfJu) {
				room.state = RoomState.ROOMOVER
			} else {
				room.state = RoomState.JUOVER
			}
		} else {
			room.state = RoomState.GAMEOVER
		}
	}
}

module.exports = {
	getRoomData,
	startRoom,
	startGame,
	startJu,
	moAction,
	startAction,
	nextUser
}
