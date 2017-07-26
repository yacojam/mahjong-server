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
			seatsData,
			leftNum: room.leftPais.length
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

async function sendActions(room, seat) {
	connectionManager.sendMessage(seat.userid, 'game_actions', {
		actions: seat.actions
	})
}

async function publishChuAction(room, seat, action) {
	room.seats.forEach(seatItem => {
		connectionManager.sendMessage(seatItem.userid, 'game_chu_push', {
			index: room.index,
			userid: seat.userid,
			pai: action.pai
		})
	})
}

async function publishMoAction(room, seat, moPai) {
	room.seats.forEach(seatItem => {
		let data = { index: room.index, userid: seat.userid }
		if (seat.userid === seatItem.userid) {
			data.pai = moPai
		}
		connectionManager.sendMessage(seatItem.userid, 'game_mo_push', data)
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
	sendActions,
	publishMoAction
}
