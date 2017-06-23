DROP TABLE IF EXISTS nv_users;
CREATE TABLE nv_users (
  userid int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  account varchar(64) NOT NULL COMMENT '手机账号',
  wxid varchar(64) DEFAULT NULL COMMENT '微信唯一标识',
  name varchar(32) NOT NULL COMMENT '用户昵称',
  sex int(1) DEFAULT 1,
  headimg varchar(256) DEFAULT NULL,
  card int(11) DEFAULT 9 COMMENT '房卡',
  roomid varchar(8) DEFAULT NULL COMMENT '用户当前房间ID',
  PRIMARY KEY (userid),
  UNIQUE KEY account (account)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO `nv_users` VALUES ('1', '13311111111', '', '小白1', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('2', '13311111112', '', '小白2', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('3', '13311111113', '', '小白3', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('4', '13311111114', '', '小白4', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('5', '13311111115', '', '小白5', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('6', '13311111116', '', '小白6', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('7', '13311111117', '', '小白7', '0', null, '9', null);
INSERT INTO `nv_users` VALUES ('8', '13311111118', '', '小白8', '1', null, '9', null);

DROP TABLE IF EXISTS nv_cardrules;
CREATE TABLE nv_cardrules (
  id int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '房卡规则id',
  rname varchar(32) NOT NULL COMMENT '描述',
  cardnum int(11) DEFAULT 9 COMMENT '该玩法所需房卡',
  addr varchar(8) DEFAULT NULL COMMENT '房卡规则来源地'
  PRIMARY KEY (id),
  UNIQUE KEY rname (rname)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT INTO `nv_cardrules` VALUES ('1', '一刀一打', 1, 'hx');
INSERT INTO `nv_cardrules` VALUES ('2', '两刀连打', 2, 'hx');

CREATE TABLE nv_rooms (
  uuid char(20) NOT NULL,
  roomid char(8) NOT NULL,
  ruleid int(11) unsigned NOT NULL,
  room_info varchar(256) NOT NULL DEFAULT '',
  userid0 int(11) NOT NULL,
  userid1 int(11) NOT NULL,
  userid2 int(11) NOT NULL,
  userid3 int(11) NOT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `roomid` (`roomid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


