const userConnections = {}

function bind(socket, userid) {
	userConnections[userid] = socket
	socket.userid = userid
}

function del(userid) {
	if (!!userConnections[userid]) {
		userConnections[userid].userid = null
		delete userConnections[userid]
	}
}

function sendMessage(userid, message, data) {
	if (!!userConnections[userid]) {
		userConnections[userid].emit(message, data)
	}
}

module.exports = {
	bind,
	del,
	sendMessage
}
