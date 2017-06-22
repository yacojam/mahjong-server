DROP TABLE IF EXISTS t_users;
CREATE TABLE t_users (
  userid int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  account varchar(64) NOT NULL COMMENT '手机账号',
  password varchar(64) NOT NULL COMMENT '密码',
  wxid varchar(64) DEFAULT NULL COMMENT '微信唯一标识',
  name varchar(32) NOT NULL COMMENT '用户昵称',
  sex int(1) DEFAULT 1,
  headimg varchar(256) DEFAULT NULL,
  gems int(11) DEFAULT 0 COMMENT '用户房卡',
  roomid varchar(8) DEFAULT NULL COMMENT '用户当前房间ID',
  PRIMARY KEY (userid),
  UNIQUE KEY account (account)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO `t_users` VALUES ('1', '13311111111',' test', '', '小白1', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('2', '13311111112', 'test', '', '小白2', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('3', '13311111113', 'test', '', '小白3', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('4', '13311111114', 'test', '', '小白4', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('5', '13311111115', 'test', '', '小白5', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('6', '13311111116', 'test', '', '小白6', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('7', '13311111117', 'test', '', '小白7', '0', null, '9', '');
INSERT INTO `t_users` VALUES ('8', '13311111118', 'test', '', '小白8', '1', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCwxaK8h699qf2PWelTDQ3AaYZK6BbehjkS7PSKxzQA6UAo7GSFXk038sibzRdha1HTL4DiaAStplmw/0', '9', '');

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


