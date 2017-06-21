const dbHelper = require('../db/dbHelper');
dbHelper.init();
const Router = require('koa-router')
const router = new Router()

router.get('/login', ctx => {
    var account = ctx.req.account;
    var password = ctx.req.password;
    var deviceid = ctx.req.deviceid;
    dbHelper.get_account_info(account,password,function(data){
    	if (data == null) {
    		
    	};
    });
})

module.exports = router