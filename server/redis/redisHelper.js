const Redis = require('ioredis')

var redis = new Redis({
  port: 6379,
  host: '106.15.206.180',
  password: 'Njnova211'
})

function set(a, b) {
  redis.set(a, b)
}

function get(a) {
  return new Promise(resolve => {
    redis.get(a, function(err, data) {
      if (err) {
        resolve(null)
      }
      resolve(data)
    })
  })
}

function del(a) {
  redis.del(a)
}

function sadd(a, b) {
  redis.sadd(a, b)
}

function srem(a, b) {
  redis.srem(a, b)
}

function smembers(a) {
  return new Promise(resolve => {
    redis.smembers(a, function(err, data) {
      if (err) {
        resolve(null)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = { set, get, del, sadd, srem, smembers }

// sadd('a', 'b')
// sadd('a', 'c')
// redis.smembers('a', function(err, data) {
//   console.log('data')
//   console.log(data[0])
//   console.log(data[1])
//   console.log(typeof data)
// })
