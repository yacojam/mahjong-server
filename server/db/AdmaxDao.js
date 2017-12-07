const DBBase = require('./DBBase')
const ADMAX_TABLE = 'admax_user'
const CONFIG_TABLE = 'version_configs'

const CONFIG_FIELDS = {
  versioncode: 'versionCode',
  versionname: 'versionName',
  shareurl: 'shareUrl',
  serviceweixin: 'serviceWeixin',
  tasteenable: 'tasteEnable',
  tasteaccount: 'tasteAccount',
  createtime: 'createTime' 
}

exports.getConfig = async function(versionName) {
  const cfg = await DBBase.select(CONFIG_TABLE, `versionname='${versionName}'`)
  return fieldMapper(cfg)
}

exports.getAllConfigs = async function() {
  const records = await DBBase.selectAll(CONFIG_TABLE, 'versioncode is not null')
  return records ? records.map(fieldMapper) : []
}

exports.updateOrCreateConfig = async function(data) {
  if (data.versionCode) {
    await DBBase.update(CONFIG_TABLE, data, `versioncode='${data.versionCode}'`)
  } else {
    data.createTime = getTimeString()
    await DBBase.insert(CONFIG_TABLE, data)  
  }
  let newVersion = await DBBase.select(CONFIG_TABLE, `versionname='${data.versionName}'`)
  return fieldMapper(newVersion)
}

exports.deleteConfig = function(versionCode) {
    return DBBase.deleteWhere(CONFIG_TABLE, `versioncode='${versionCode}'`)
}

exports.getUser = function(username, passwd) {
  return DBBase.select(ADMAX_TABLE, `username='${username}'` + (passwd ? ` and passwd='${passwd}'` : ''), ['userid', 'username', 'permission', 'userrole'])
}

exports.getUserById = function(userid) {
  return DBBase.select(ADMAX_TABLE, `userid='${userid}'`, ['userid', 'username', 'permission', 'userrole'])
}

// 转换大小写和tinyint
function fieldMapper(record) {
  const cfgObj = {}
  Object.keys(CONFIG_FIELDS).forEach(key=>{
    cfgObj[CONFIG_FIELDS[key]] = record[key]
  })
  cfgObj.tasteEnable = cfgObj.tasteEnable === 1
  return cfgObj
}

function getTimeString() {
  const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}
