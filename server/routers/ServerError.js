var ServerError = function(code, msg) {
	this.code = code
	this.message = msg
}

function generateError(msg) {
	return new ServerError(-1, msg)
}

var AccountValidError = generateError('账户信息过期，请重新登陆')
exports.AccountValidError = AccountValidError

var AccountError = generateError('账户不存在')
exports.AccountError = AccountError

var CardNotEnoughError = generateError('房卡不够')
exports.CardNotEnoughError = CardNotEnoughError

var RoomCreateError = generateError('创建房间失败')
exports.RoomCreateError = RoomCreateError

var RoomHasFullError = generateError('房间已满')
exports.RoomHasFullError = RoomHasFullError

var RoomNotExistError = generateError('房间不存在')
exports.RoomNotExistError = RoomNotExistError

var ParamsNotVavidError = generateError('进入房间参数错误')
exports.ParamsNotVavidError = ParamsNotVavidError
