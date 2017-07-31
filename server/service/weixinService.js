const request = require('request')

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
      console.log(body)
      const json = JSON.stringify(body)
      if (json.errcode != 0) {
        throw json.errmsg
      }
      resolve(body)
    })
  })
}

module.exports = {
  getAccessToken
}
