const UserDao = require('../db/UserDao');
const RoomDao = require('../db/RoomDao');

const cryptoHelper = require('../md5/cryptoHelper');
const redis = require('../redis/redisHelper');

const ErrorType = require('./ServerError');

const Router = require('koa-router');
const router = new Router();

router.get('/create_private_room', async(ctx, next) => {
	var userid = ctx.query.userid;
	var deviceid = ctx.query.deviceid;
    var isValid = await redis.isAccountValid(userid,deviceid,token);
    if (isValid) {
        dbHelper.get_card_of_account(account,function(ret1){
        	if (ret1 == 0) {
                ctx.throw('your account not have enough card',515);
        	} else {
        		var ruleid = ctx.query.ruleid;
                dbHelper.get_cardnum_of_ruleid(ruleid, function(ret2){
                    if (ret2 == 0) {
                        ctx.throw('rule is invalid',516);
                    } else {
                        if (ret1 < ret2) {
                            ctx.throw('your account not have enough card',515);
                        } else {
                        	//可以创建房间

                        }
                    }
                });
        	}
        });
    } else {
    	ctx.throw('account is not valid, please relogin',514);
    }
});

module.exports = router