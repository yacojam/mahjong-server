var ServerError = function(code, msg){
	this.code = code;
	this.message = msg;
};

function generateError(code, msg){
	return new ServerError(code,msg);
};

 var RegisterError = generateError(513,'account has been registered');
 exports.RegisterError = RegisterError;

 var AccountValidError = generateError(514,'account is not valid, please relogin');
 exports.AccountValidError = AccountValidError;

 var AccountError = generateError(515,'account is not existed');
 exports.AccountError = AccountError;

 var CardNotEnoughError = generateError(516, 'your account not have enough card');
 exports.CardNotEnoughError = CardNotEnoughError;