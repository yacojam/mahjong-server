use Nova_game;

DROP TABLE IF EXISTS nv_users;
CREATE TABLE nv_users (
  userid int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  account varchar(64) DEFAULT NULL COMMENT '手机账号',
  wxid varchar(64) DEFAULT NULL COMMENT '微信唯一标识',
  name varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT '用户昵称',
  sex int(1) DEFAULT 1,
  headimg varchar(256) DEFAULT NULL,
  city varchar(64) DEFAULT NULL,
  province varchar(64) DEFAULT NULL,
  card int(11) DEFAULT 9 COMMENT '房卡',
  roomid varchar(8) DEFAULT '' COMMENT '用户当前房间ID',
  PRIMARY KEY (userid),
  UNIQUE KEY account (account)
) ENGINE=InnoDB AUTO_INCREMENT=100009 DEFAULT CHARSET=utf8;

INSERT INTO `nv_users` VALUES ('100001', '13311111111', '', '小白1', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100002', '13311111112', '', '小白2', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100003', '13311111113', '', '小白3', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100004', '13311111114', '', '小白4', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100005', '13311111115', '', '小白5', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100006', '13311111116', '', '小白6', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100007', '13311111117', '', '小白7', '1', null, '', '', '9', '');
INSERT INTO `nv_users` VALUES ('100008', '13311111118', '', '小白8', '1', null, '', '', '9', '');

-- DROP TABLE IF EXISTS nv_cardrules;
-- CREATE TABLE nv_cardrules (
--   id int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '房卡规则id',
--   rname varchar(32) NOT NULL COMMENT '描述',
--   cardnum int(11) DEFAULT 9 COMMENT '该玩法所需房卡',
--   addr varchar(8) DEFAULT NULL COMMENT '房卡规则来源地',
--   PRIMARY KEY (id),
--   UNIQUE KEY rname (rname)
-- ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- INSERT INTO `nv_cardrules` VALUES ('1', '一刀一打', 1, 'hx');
-- INSERT INTO `nv_cardrules` VALUES ('2', '两刀连打', 2, 'hx');

DROP TABLE IF EXISTS nv_rooms;
CREATE TABLE nv_rooms (
  id int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '房间id',
  presentid varchar(8) NOT NULL COMMENT '对外6位随机数字',
  baseinfo varchar(256) NOT NULL,
  createuserid int(11) NOT NULL,
  createtime varchar(16) NOT NULL,
  userid0 int(11),
  userid1 int(11),
  userid2 int(11),
  userid3 int(11),
  gameids varchar(16) DEFAULT NULL,
  roomresult varchar(8) DEFAULT NULL COMMENT '房间结算',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS nv_games;
CREATE TABLE nv_games(
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  rid int(11) unsigned NOT NULL COMMENT '房间id',
  gamenum int(11) unsigned NOT NULL COMMENT '第几局',
  junum int(11) unsigned NOT NULL COMMENT '第几刀',
  scores varchar(256) NOT NULL COMMENT '4名玩家初始score，包括自摸点数',
  pais varchar(256) NOT NULL COMMENT '4名玩家初始手牌,形如[]&[]&[]&[]',
  dingques varchar(256) NOT NULL COMMENT '4名玩家定缺type,形如1&2&3&2',
  actions varchar(2048) NOT NULL COMMENT '一个牌局中记录的所有的actions，形如[2&3&23, 2&3&23...]',
  gameresult varchar(256) DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  
----type : 1, 代表qps的申请消息----
DROP TABLE IF EXISTS nv_msg;
CREATE TABLE nv_msg (
  id int(12) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  from int(11) unsigned NOT NULL COMMENT '用户ID',
  to int(11) unsigned NOT NULL COMMENT '用户ID',
  title varchar(50) DEFAULT NOT NULL COMMENT '消息内容',
  content varchar(256) DEFAULT NOT NULL COMMENT '消息内容',
  type int(4) unsigned NOT NULL COMMENT '消息类型',
  state int(4) DEFAULT 0 NOT NULL COMMENT '未读(0)，已读(1)',
  dataif int(10) unsigned NOT NULL COMMENT '关联数据id',
  updatetime timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

