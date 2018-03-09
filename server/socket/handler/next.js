const HXMJManager = require('../../algorithm/HxmjRules/HxmjManager')
const Action = require('../../algorithm/HxmjRules/hxaction')
const Publish = require('../dataflow/publish')
const Pending = require('../../algorithm/HxmjRules/pendingtype')
const connectionManager = require('../../manager/connectionManager/connectionManager')
const roomManager = require('../../manager/roomManager/roomManager')

const RoomState = {
	READY: 0,
	QINGQUE: 1,
	PLAY: 2,
	GAMEOVER: 3,
	JUOVER: 4,
	ROOMOVER: 5
}

async function getRoomData(room, uid) {
	let ret = {}
	let {
		roomPresentId,
		state,
		conf,
		seats,
		dealerIndex,
		index,
		leftPais,
		currentJu,
		currentGame,
		isJuSameWithRoom,
		qpsid
	} = room

	let seatsData = seats
		.filter(seat => {
			return seat.userid > 0 && seat.index >= 0
		})
		.map(seat => {
			let { userid, username, headimg, sip, index, ready, sex } = seat
			let { shouPais, chuPais, pengPais, gangPais, anGangPais } = seat
			let { score, moMoney, que, pendingAction, actions } = seat
			let { gameResult, juResult, roomResult } = seat
			let online = connectionManager.get(userid) != null || userid == uid
			let isCreator = seat.isCreator
			let shouPaisNum = shouPais ? shouPais.length : null
			if (userid !== uid) {
				actions = []
				pendingAction = null
				if (state === RoomState.PLAY || state === RoomState.QINGQUE) {
					shouPais = []
				}
			}
			return {
				userid,
				username,
				headimg,
				sip,
				sex,
				index,
				ready,
				isCreator,
				online,
				score,
				moMoney,
				shouPais,
				chuPais,
				pengPais,
				gangPais,
				anGangPais,
				que,
				actions,
				pendingAction,
				shouPaisNum,
				gameResult,
				juResult,
				roomResult
			}
		})
	ret.success = true
	ret.data = {
		qpsid,
		roomId: roomPresentId,
		isJuSameWithRoom,
		state,
		conf,
		dealerIndex,
		leftNum: leftPais.length,
		turn: room.index,
		currentJu,
		currentGame,
		seats: seatsData
	}
	return ret
}

async function start(room, isRoom, isJu, isGame) {
	room.state = RoomState.QINGQUE
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
	if (room.state === RoomState.READY) {
		await roomManager.startRoom(room)
		await start(room, true, false, false)
	}
	if (room.state === RoomState.GAMEOVER) {
		await start(room, false, false, true)
	}
	if (room.state === RoomState.JUOVER) {
		await start(room, false, true, false)
	}
}

async function moAction(room, pAction, gang = false) {
	if (room.leftPais.length === 0) {
		endGameWithLiuJu(room)
		await Publish.publishLiuju(room)
		return
	}
	let seat = room.seats[room.index]
	let moPai = gang ? room.leftPais.shift() : room.leftPais.pop()
	let rAction = gang
		? Action.makeupAction(Action.ACTION_GMO, moPai)
		: Action.makeupAction(Action.ACTION_MO, moPai)
	room.recordAction(seat, rAction)
	let actions = HXMJManager.getActions(
		seat.shouPais,
		seat.pengPais,
		pAction,
		moPai,
		seat.que,
		room.leftPais.length
	)
	if (actions.length === 0) {
		actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
	} else {
		room.pendingType = Pending.PENDING_TYPE_MO
	}
	seat.actions = actions
	seat.shouPais.push(moPai)
	await Publish.publishMoAction(room, seat, moPai)
	await Publish.sendActions(room, seat)
}

function endGameWithLiuJu(room) {
	room.pendingType = Pending.PENDING_TYPE_NULL
	room.recordLiuju()
	room.seats.forEach(seatItem => {
		seatItem.ready = false
		seatItem.actions = []
		seatItem.pendingAction = null
		seatItem.gameResult = null
	})
	room.state = RoomState.GAMEOVER
}

async function startAction(room) {
	room.state = RoomState.PLAY
	roomManager.startRoomRecord(room)
	let seat = room.seats[room.index]
	let copyShouPais = seat.shouPais.concat()
	let moPai = copyShouPais.pop()
	let actions = HXMJManager.getActions(
		copyShouPais,
		[],
		Action.ACTION_MO,
		moPai,
		seat.que,
		room.leftPais.length
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
	const index = (room.index + 1) % room.seats.length
	room.index = index
	await moAction(room, Action.ACTION_MO)
	return room
}

module.exports = {
	getRoomData,
	startRoom,
	moAction,
	startAction,
	nextUser,
	RoomState: RoomState
}
