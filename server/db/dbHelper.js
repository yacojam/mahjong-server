

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