const DBBase = require('./DBBase')
const ADMAX_TABLE = 'admax_user'
const CONFIG_TABLE = 'version_configs'

exports.getAllConfigs = function() {
  return DBBase.select(CONFIG_TABLE, 'versioncode is not null')
}

exports.updateOrCreateConfig = async function(data) {
  if (data.versionCode) {
    await DBBase.update(CONFIG_TABLE, `versioncode='${versionCode}'`, data)
  } else {
    await DBBase.insert(CONFIG_TABLE, data)  
  }
  let newVersion = await DBBase.select(CONFIG_TABLE, `versionname='${data.versionName}'`)
  return newVersion
}

exports.deleteConfig = function(versionCode) {
    return DBBase.deleteWhere(CONFIG_TABLE, `versioncode='${versionCode}'`)
}

exports.getUser = function(username, passwd) {
  return DBBase.select(ADMAX_TABLE, `username='${username}' and passwd='${passwd}'`)
}
