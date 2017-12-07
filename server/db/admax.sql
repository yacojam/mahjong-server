use Nova_game;

DROP TABLE IF EXISTS admax_user;

CREATE TABLE admax_user (
  userId int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  userName varchar(16) NOT NULL COMMENT '用户名',
  passwd varchar(16) NOT NULL COMMENT '密码',
  userRole varchar(12) DEFAULT NULL COMMENT '用户角色',
  permission varchar(256) DEFAULT NULL COMMENT '拥有权限',
  PRIMARY KEY (userid),
  UNIQUE KEY userName (userName)
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8;

INSERT INTO `admax_user` VALUES ('100000', 'admin', 'yyj@1204', 'admin', null);
INSERT INTO `admax_user` VALUES ('100001', 'usermgr', 'Nj_Nova211', 'usermanager', null);

DROP TABLE IF EXISTS version_configs;

CREATE TABLE version_configs (
  versioncode int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '版本序号',
  versionname varchar(15) NOT NULL COMMENT '显示版本号',
  downloadurl varchar(100) NOT NULL COMMENT '下载地址',
  serviceweixin varchar(50) DEFAULT NULL COMMENT '客服微信号',
  tasteenable bool NOT NULL COMMENT '是否开启体验入口',
  tasteaccount varchar(50) DEFAULT NULL COMMENT '体验账号',
  configtime varchar(20) DEFAULT NULL COMMENT '配置时间',
  PRIMARY KEY (versioncode),
  UNIQUE KEY versionname (versionname)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

