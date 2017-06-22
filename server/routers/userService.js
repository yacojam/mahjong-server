
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
    dbHelper.get_account_info(account,function(data){
        if (data == null) {
    		if (dev) {
    			ctx.throw('account is not consitent with the password', 512);
    		} else {
   				//数据库没有该用户，为该手机号码创建账户
    			dpHelper.create_account(account,'','赌棍',1,'',function(success){
    				if (success) {
    					//生成token
                        var token = cryptoHelper.md5(account + deviceid);
                        var date = new Date();
                        date.setDate(date.getDate()+60);
                        var validStamp = Date.parse(date);
                        redis.set(account,[token,validStamp]);
    					var ret = {
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
    			});
    		};		
    	} else {
    		var token = cryptoHelper.md5(account + deviceid);
            var date = new Date();
            date.setDate(date.getDate()+60);
            var validStamp = Date.parse(date);
            redis.set(account,[token,validStamp]);
    		var ret = {
    	    	account : data.account,
    	    	wxid : data.wxid,
    	    	name : data.name,
    	    	sex : data.set,
    	    	headimg : data.headimg,
    	    	card : data.card,
    	    	roomid : data.roomid,
    	    	token : token
    	    };
    	    ctx.body = ret;
    	};
    });
});

router.get('/create_private_room', async(ctx, next) => {

});

module.exports = router