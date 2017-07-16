var ServerError = function(code, msg) {
	this.code = code
	this.message = msg
}

function generateError(code, msg) {
	return new ServerError(code, msg)
}

var RegisterError = generateError(513, 'account has been registered')
exports.RegisterError = RegisterError

var AccountValidError = generateError(
	514,
	'account is not valid, please relogin'
)
exports.AccountValidError = AccountValidError

var AccountError = generateError(515, 'account is not existed')
exports.AccountError = AccountError

var CardNotEnoughError = generateError(601, '房卡不够')
exports.CardNotEnoughError = CardNotEnoughError

var RoomCreateError = generateError(602, '创建房间失败')
exports.CardNotEnoughError = CardNotEnoughError

var RoomHasFullError = generateError(603, '房间已满')
exports.RoomHasFullError = RoomHasFullError

var RoomNotExistError = generateError(604, '房间不存在')
exports.RoomNotExistError = RoomNotExistError

var ParamsNotVavidError = generateError(651, '进入房间参数错误')
exports.ParamsNotVavidError = ParamsNotVavidError
