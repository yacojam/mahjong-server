const request = require('request')
const DBBase = require('../db/DBBase')

const AppSecret = 'a7aa5b67373af823277d447a770bc0c6'
const AppID = 'wx06b2ebbddec91ae3'
function getAccessToken(code) {
  if (!code) {
    throw `code is empty`
  }
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${AppID}&secret=${AppSecret}&code=${code}&grant_type=authorization_code`
  return new Promise((resolve, reject) => {
    request(url, function(error, response, body) {
      if (error) {
        return reject(error)
      }
      const json = JSON.parse(body)
      if (json.errcode) {
        reject(json.errmsg)
      }
      resolve(json)
    })
  })
}

function getWeixinUserInfo(accessToken, openid) {
  if (!accessToken || !openid) {
    throw 'invalid params in getUserInfo'
  }
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}`
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        return reject(error)
      }
      const json = JSON.parse(body)
      if (json.errcode) {
        throw json.errmsg
      }
      resolve(json)
    })
  })
}

function saveUser(user, openid) {
  return DBBase.insertOrUpdate(`nv_weixin_users`, user, `openid='${openid}'`)
}

function getUserInfo(openid) {
  return new Promise((resolve, reject) => {
    DBBase.query(
      'select * from `nv_users` where `wxid` = ?',
      [openid],
      (error, results, fields) => {
        if (results && results.length > 0) {
          resolve(results[0])
        } else {
          resolve(null)
        }
      }
    )
  })
}

module.exports = {
  getAccessToken,
  getWeixinUserInfo,
  getUserInfo,
  saveUser
}
