const connectionManager = require('../connectionManager')

async function publishGameStart(room) {
	console.log('send game start info')
	let { currentJu, currentGame, dealerIndex, state } = room
	let seatsData = room.seats.map(s => {
		let { score, moMoney, index, userid } = s
		return { score, moMoney, index, userid }
	})
	room.seats.forEach(seat => {
		let { actions, shouPais, score, moMoney } = seat
		connectionManager.sendMessage(seat.userid, 'game_start_push', {
			state,
			shouPais,
			currentJu,
			currentGame,
			dealerIndex,
			seatsData
		})
	})
}

async function publishDingQue(room) {
	console.log('send dingque actions')
	room.seats.forEach(seat => {
		connectionManager.sendMessage(seat.userid, 'dingque_action', {})
	})
}

async function publishDingqueResult(room) {
	let ret = room.seats.map(seat => {
		let { que, index, userid } = seat
		return { que, index, userid }
	})
	room.seats.forEach(seat => {
		connectionManager.sendMessage(seat.userid, 'dingque_result', ret)
	})
}

async function sendMoAction(room, seat) {
	connectionManager.sendMessage(seat.userid, 'self_mo', {
		actions: seat.actions,
		index: room.index
	})
}

async function sendMoCancel(room, seat) {
	connectionManager.sendMessage(seat.userid, 'self_mo_cancel', {
		actions: seat.actions
	})
}

async function publishChuAction(room, seat, action) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'user_chu', {
			userid: seat.userid,
			pai: action.pai,
			actions: seatItem.actions
		})
	})
}

async function publishMoAction(room, seat) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'user_mo', {})
	})
}

async function publishPengAction(room, seat) {}

async function publishAnGangAction(room, seat) {}

async function publishWanGangAction(room, seat) {}

async function publishPGangAction(room, seat) {}

async function publishHuAction(room, seat, action) {}

module.exports = {
	publishGameStart,
	publishDingQue,
	publishDingqueResult,
	sendMoAction,
	sendMoCancel,
	publishMoAction
}
