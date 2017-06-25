var mysql = require('mysql');
var config = require('../config/config');

var pool = null;

exports.init = function(){
    pool = mysql.createPool({
	    host : '106.15.206.180',
	    user : 'test',
	    password : 'Njnova211',
	    port : '3306',
	    database :'Nova_game'
    });
};

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

/** 获取用户信息，没有数据返回 null **/
exports.sync_get_account_info = async function(account){
    return new Promise(resolve => {
        if(account == null || account == ''){
            resolve(null);
        }  
        var sql = 'SELECT * FROM nv_users WHERE account = "' + account + '"';
        query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null);
            }
            if(rows.length == 0){
                resolve(null);
            }
            resolve(rows[0]);
        }); 
    });
};

exports.sync_get_account_info_by_userid = async function(userid){
    return new Promise(resolve => {
        if(account == null || account == ''){
            resolve(null);
        }  
        var sql = 'SELECT * FROM nv_users WHERE userid = "' + userid + '"';
        query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null);
            }
            if(rows.length == 0){
                resolve(null);
            }
            resolve(rows[0]);
        }); 
    });
};


/** 创建用户，测试环境下不做测试 **/
exports.sync_create_account = async function(account,wxid,name,sex,headimg){
    return new Promise(resolve => {
        if(account == null || name == null || account == ''|| name == ''){
            resolve(false);
        }
        var sql = 'INSERT INTO nv_users(account,wxid,name,sex,headimg) VALUES("' + account + '","' + wxid + '","'+ name +'",'+ sex +',"'+ headimg +'")';
        query(sql, function(err, rows, fields) {
            if (err) {
                resolve(false);
            } else { 
                resolve(true);            
            }
        });
    });
};

exports.sync_get_userid_of_account = async function(account){
    return new Promise(resolve => {
        if (account == null || account == '') {
            resolve(0);
        };
        var sql = 'select userid from nv_users where account = "'+ account +'"';
        query(sql, function(err, rows, fields) {
            if (err) {
                resolve(0);
            } else { 
                resolve(rows[0].userid);            
            }
        });
    });
};

exports.sync_get_roomid_of_userid = async function(userid){
    return new Promise(resolve => {
        if (account == null || account == '') {
            resolve(null);
        };
        var sql = 'select roomid from nv_users where userid = "'+ userid +'"';
        query(sql, function(err, rows, fields) {
            if (err) {
                resolve(null);
            } else { 
                resolve(rows[0].userid);            
            }
        });
    });
};

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
                callback(rows[0].card);
            }
            else{
                callback(0);
            }
        }
    });
};

/** 创建房间 **/
exports.create_room = function(){};

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