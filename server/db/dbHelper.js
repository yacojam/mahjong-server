var mysql = require('mysql');
var pool = null;

function nop(a,b,c,d,e,f,g){

}

function query(sql,callback){  
    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null);  
        }else{  
            conn.query(sql,function(qerr,vals,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(qerr,vals,fields);  
            });  
        }  
    });  
};

exports.init = function(){
    pool = mysql.createPool({
	    host : '106.15.206.180',
	    user : 'test',
	    password : 'Njnova211',
	    port : '3306',
	    database :'Nova_game'
    });
};

exports.get_account_info = function(account,password,callback){
    if(account == null || password == null){
        callback(null);
        return;
    }  

    var sql = 'SELECT * FROM t_users WHERE account = "' + account + '" and password = "'+ password +'"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        
        if(rows.length == 0){
            callback(null);
            return;
        }
        callback(rows[0]);
    }); 
};

exports.is_account_exists = function(account,callback){
	callback = callback == null? nop:callback;
    if(account == null){
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
    	console.log(rows);
    	console.log(fields);
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

exports.create_account = function(account,password,name,sex,headimg,callback){
    callback = callback == null? nop:callback;
    if(account == null || password == null || name == null){
        callback(false);
        return;
    }
    var gems = 9;
    var psw = crypto.md5(password);
    var sql = 'INSERT INTO t_users(account,password,name,sex,headimg,gems) VALUES("' + account + '","' + psw + '","'+ name +'")';
    query(sql, function(err, rows, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                callback(false);
                return;         
            }
            callback(false);
            throw err;
        }
        else{
            callback(true);            
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