//const co = require('co');
const dbHelper = require('../db/dbHelper');
dbHelper.init();
const config = require('../config/config');
const dev = config.DEV;

const cryptoHelper = require('../md5/cryptoHelper');
const redis = require('../redis/redisHelper');

const Router = require('koa-router');
const router = new Router();

router.post('/login', async(ctx, next) => {
    var account = ctx.request.body.account;
    var deviceid = ctx.request.body.deviceid;
    var userData = await dbHelper.sync_get_account_info(account);
    console.log(userData);
    if (userData == null) {
        if (dev) {
            ctx.throw('account is not consitent with the password', 512);
        } else {
            //数据库没有该用户，为该手机号码创建账户
            var success = await dpHelper.create_account(account,'','赌棍',1,'');
            if (success) {
                //获取userid
                var userid = await dpHelper.sync_get_userid_of_account(account);
                //生成token
                var token = cryptoHelper.md5(account + deviceid);
                var date = new Date();
                date.setDate(date.getDate()+60);
                var validStamp = Date.parse(date);
                redis.set(account+'token',token);
                redis.set(account+'validtime',validStamp);
                var ret = {
                    userid : userid,
                    account : account,
                    wxid : '',
                    name : '赌棍',
                    sex : 1,
                    headimg : '',
                    card : 9,
                    roomid : '',
                    token : token
                };
                ctx.body = ret;
            } else {
                ctx.throw('account has been registered', 513);
            };  
        }      
    } else {
        var token = cryptoHelper.md5(account + deviceid);
        var date = new Date();
        date.setDate(date.getDate()+60);
        var validStamp = Date.parse(date);
        redis.set(account+'token',token);
        redis.set(account+'validtime',validStamp);
        var ret = {
            userid : userData.userid,
            account : userData.account,
            wxid : userData.wxid,
            name : userData.name,
            sex : userData.set,
            headimg : userData.headimg,
            card : userData.card,
            roomid : userData.roomid,
            token : token
        };
        console.log(ret);
        ctx.body = ret;
    }; 
});

router.get('/create_private_room', async(ctx, next) => {
	var account = ctx.query.account;
	var deviceid = ctx.query.deviceid;
    if (isAccountValid) {
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

function isAccountValid(account, deviceid){
	var value = redis.get(account);
	if (value == null) {
		return false;
	};
	var token = cryptoHelper.md5(account + deviceid);
	var nowStamp = Date.parse(new Date());
	return token == value[0] && nowStamp <= value[1];
}

module.exports = router