DROP TABLE IF EXISTS nv_qps;
CREATE TABLE nv_qps (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '棋牌室id',
  qpsid varchar(8) NOT NULL COMMENT '棋牌室6位展示数字',
  weixin varchar(30) DEFAULT NOT NULL COMMENT '管理员微信',
  qpsname varchar(8) NOT NULL COMMENT '棋牌室名称',
  qpsnotice varchar(256) NOT NULL COMMENT '棋牌室公告',
  rules varchar(256) DEFAULT NULL COMMENT '棋牌室规则数组',
  state tinyint DEFAULT NULL COMMENT '棋牌室状态(1:运行中，-1: 停运)',
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

DROP TABLE IF EXISTS qps_apply;
CREATE TABLE qps_apply (
  id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  senderid int(11) unsigned NOT NULL COMMENT '申请人ID',
  sendername varchar(30) NOT NULL COMMENT '申请人名称',
  qpsid int(10) DEFAULT NULL COMMENT '棋牌室id',
  state int(4) DEFAULT 0 NOT NULL COMMENT '待处理(0)，已同意(1)，已拒绝(-1)',
  updatetime timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;
