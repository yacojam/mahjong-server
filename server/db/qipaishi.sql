DROP TABLE IF EXISTS nv_qps;
CREATE TABLE nv_qps (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '棋牌室id',
  qpsid varchar(8) NOT NULL COMMENT '棋牌室6位展示数字',
  qpsname varchar(8) NOT NULL COMMENT '棋牌室名称',
  qpsnotice varchar(256) NOT NULL COMMENT '棋牌室公告',
  rules varchar(256) DEFAULT NULL COMMENT '棋牌室规则数组',
  PRIMARY KEY (id),
  UNIQUE KEY qpsid (qpsid)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS nv_qps_user;
CREATE TABLE nv_qps_user (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  userid int(11) unsigned NOT NULL COMMENT '用户ID',
  qpsid varchar(8) NOT NULL COMMENT '棋牌室6位展示数字',
  iscreator bool NOT NULL COMMENT '是否是创建者',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

----type : 1, 代表qps的申请消息----
DROP TABLE IF EXISTS nv_msg;
CREATE TABLE nv_msg (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  userid int(11) unsigned NOT NULL COMMENT '用户ID',
  content varchar(256) DEFAULT NULL COMMENT '消息内容',
  type int(10) unsigned NOT NULL COMMENT '消息类型',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;
