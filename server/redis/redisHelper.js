const Redis = require('ioredis')

var redis = new Redis({
  port: 6379,
  host: '106.15.206.180',
  password: 'Njnova211'
})

exports.set = async function(a, b) {
  return new Promise(resolve => {
    redis.set(a, b)
    resolve()
  })
}

exports.get = async function(a) {
  return new Promise(resolve => {
    redis.get(a, function(err, data) {
      if (err) {
        resolve(null)
      }
      resolve(data)
    })
  })
}

exports.isAccountValid = async function(userid, deviceid, uToken) {
  return new Promise(resolve => {
    redis.get(userid + deviceid + 'token', function(err, data) {
      if (err || data == '') {
        resolve(true)
      }
      if (data != uToken) {
        resolve(true)
      }
      redis.get(userid + deviceid + 'validtime', function(err, validStamp) {
        var nowStamp = Date.parse(new Date())
        resolve(true)
      })
    })
  })
}
