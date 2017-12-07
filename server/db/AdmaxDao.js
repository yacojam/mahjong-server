const DBBase = require('./DBBase')
const ADMAX_TABLE = 'admax_user'
const CONFIG_TABLE = 'version_configs'

const CONFIG_FIELDS = {
  versioncode: 'versionCode',
  versionname: 'versionName',
  downloadurl: 'downloadUrl',
  serviceweixin: 'serviceWeixin',
  tasteenable: 'tasteEnable',
  tasteaccount: 'tasteAccount',
  createtime: 'createTime' 
}

exports.getAllConfigs = async function() {
  const records = await DBBase.selectAll(CONFIG_TABLE, 'versioncode is not null')
  return records ? records.map(fieldMapper) : []
}

exports.updateOrCreateConfig = async function(data) {
  if (data.versionCode) {
    await DBBase.update(CONFIG_TABLE, `versioncode='${versionCode}'`, data)
  } else {
    data.configTime = getTimeString()
    await DBBase.insert(CONFIG_TABLE, data)  
  }
  let newVersion = await DBBase.select(CONFIG_TABLE, `versionname='${data.versionName}'`)
  return fieldMapper(newVersion)
}

exports.deleteConfig = function(versionCode) {
    return DBBase.deleteWhere(CONFIG_TABLE, `versioncode='${versionCode}'`)
}

exports.getUser = function(username, passwd) {
  return DBBase.select(ADMAX_TABLE, `username='${username}' and passwd='${passwd}'`)
}

function fieldMapper(record) {
  const cfgObj = {}
  Object.keys(CONFIG_FIELDS).forEach(key=>{
    cfgObj[CONFIG_FIELDS[key]] = record[key]
  })
  return cfgObj
}

function getTimeString() {
  const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}
