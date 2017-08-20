const DBBase = require('./DBBase')

exports.updateOrCreateWXAccount = async function(wxData) {
  let { nickname, sex, city, province, headimgurl, unionid } = wxData
  let userData = {
    wxid: unionid,
    name: nickname,
    sex,
    headimg: headimgurl,
    city,
    province
  }
  let isNew = false
  let user = await DBBase.select('nv_users', `wxid='${unionid}'`)
  if (user == null) {
    isNew = true
    await DBBase.insert('nv_users', userData)
  } else {
    await DBBase.update('nv_users', userData, `wxid='${unionid}'`)
  }
  user = DBBase.select('nv_users', `wxid='${wxid}'`)
  return Object.assign({}, user, { isNew }) //{ ...user, isNew }
}

exports.getOrCreateAccount = async function(account) {
  let user = await DBBase.select('nv_users', `account='${account}'`)
  let isNew = false
  if (user == null) {
    isNew = true
    let record = { account, wxid: '', name: '小白', sex: 1, headimg: '' }
    await DBBase.insert('nv_users', account)
    user = await DBBase.select('nv_users', `account='${account}'`)
  }
  return Object.assign({}, user, { isNew }) //{ ...user, isNew }
}

exports.getUserDataByWxid = function(wxid) {
  return DBBase.select('nv_users', `wxid='${wxid}'`)
}

exports.getUserDataByUserid = function(userid) {
  return DBBase.select('nv_users', `userid='${userid}'`)
}

exports.getUserDataByAccount = function(account) {
  return DBBase.select('nv_users', `account='${account}'`)
}

exports.updateRoomID = function(userid, roomid) {
  return DBBase.update('nv_users', { roomid }, `userid='${userid}'`)
}

exports.updateUserInfo = function(userid, record) {
  return DBBase.update('nv_users', record, `userid='${userid}'`)
}

/** 获取用户当前的房卡数量 **/
exports.getCardNum = async function(userid) {
  let ret = await DBBase.select('nv_users', `userid='${userid}'`, ['card'])
  return ret ? ret.card : 0
}
