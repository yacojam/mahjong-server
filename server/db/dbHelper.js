

/** 获取用户当前的房卡数量 **/
exports.get_card_of_account = function(account,callback){
	if (account == null || account == '') {
		callback(0);
		return;
	};
	var sql = 'select card from nv_users where account = "' + account + '"';
	query(sql, function(err,rows,fields){
		if (err) {
            callback(0);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0].card);
            }
            else{
                callback(0);
            }
        }
	}); 
};



/** 获取当前玩法所需的房卡数 **/
exports.get_cardnum_of_ruleid = function(ruleid,callback){
    if (ruleid == 0) {
    	callback(0);
    	return;
    };
    var sql = 'select cardnum from nv_cardrules where id = "' + ruleid + '"';
    query(sql, function(err,rows,fields){
    	if (err) {
            callback(0);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0].cardnum);
            }
            else{
                callback(0);
            }
        }
    });
};

/** 根据当前玩法获取到ruleid **/

exports.sync_get_ruleid_of_rulename = async function(ruleName){
    return new Promise(resolve => {
        if (ruleName == '' || ruleName == null) {
            resolve(null);
        };
        var sql = 'select id from nv_cardrules where rname = "' + ruleName + '"';
        query(sql, function(err,rows,fields){
            if (err) {
                resolve(null);
            };
            if (rows.length > 0) {
                resolve(rows[0].id)
            } else {
                resolve(null);
            }
        });
    });
};



/** ***/

exports.is_account_exists = function(account,callback){
	callback = callback == null? nop:callback;
    if(account == null){
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(true);
            }
            else{
                callback(false);
            }
        }
    });
};



exports.is_wx_exists = function(wxid,callback){
    callback = callback == null ? nop:callback;
    var sql = 'SELECT * FROM t_users where wxid = "'+ wxid +'"';
    query(sql, function(err, rows, fields){
    	if (err) {
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(true);
            }
            else{
                callback(false);
            }
        }
    });
};



// exports.create_wxAccount = function(account,password,name,callback){
//     callback = callback == null? nop:callback;
//     if(account == null || password == null || name == null){
//         callback(false);
//         return;
//     }

//     var psw = crypto.md5(password);
//     var sql = 'INSERT INTO t_users(account,password,name) VALUES("' + account + '","' + psw + '","'+ name +'")';
//     query(sql, function(err, rows, fields) {
//         if (err) {
//             if(err.code == 'ER_DUP_ENTRY'){
//                 callback(false);
//                 return;         
//             }
//             callback(false);
//             throw err;
//         }
//         else{
//             callback(true);            
//         }
//     });
// };