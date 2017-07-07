const UserDao = require('../db/UserDao');
const RoomDao = require('../db/RoomDao');
const cryptoHelper = require('../md5/cryptoHelper');
const redis = require('../redis/redisHelper');
const ErrorType = require('./ServerError');
const Router = require('koa-router');
const router = new Router();
const HxRulesUtils = require('./roomRuleUtil/HxRulesUtils')

router.get('/get_rules', async (ctx, next) => {
    var userid = ctx.query.userid;
    var deviceid = ctx.query.deviceid;
    var token = ctx.query.token;
    var isValid = true;//await redis.isAccountValid(userid, deviceid, token);
    if (isValid) {
        ctx.body = HxRulesUtils.rules;
    } else {
        ctx.error = ErrorType.AccountValidError;
    }
});

//创建房间
router.get('/create_private_room', async (ctx, next) => {
	var userid = ctx.query.userid;
	var deviceid = ctx.query.deviceid;
    var token = ctx.query.token;
    var roomInfo = ctx.query.roomInfo;
    var isValid = await redis.isAccountValid(userid,deviceid,token);
    if (isValid) {
        var cardnum_of_user = await UserDao.sycn_get_card_of_account(userid);
        if (cardnum_of_user == 0) {
            ctx.error = ErrorType.CardNotEnoughError;
        } 
        else {
        	cardrulenum = HxRulesUtils.getCardOfRule(roomInfo[0]);
            if (cardrulenum > cardnum_of_user) {
                ctx.error = ErrorType.CardNotEnoughError;
            } else {
                //开始创建房间，生成6为展示ID并返回，数据库存储该房间
                
            }
        }
    } else {
    	ctx.error = ErrorType.AccountValidError;
    }
});

//解散房间
// router.get('/dissolve_private_room', async (ctx, next) => {
    
// });

//进入房间
router.get('/join_private_room', async (ctx, next) => {

});

//退出房间
// router.get('/exit_private_room', async (ctx, next) => {

// });



module.exports = router