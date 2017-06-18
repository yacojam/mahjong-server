/*
const Redis = require('ioredis')
const redis = new Redis()

*/

// use memory
const mem = {}
const redis = {
  set(key, value) {
    return new Promise(resolve => {
      mem[key] = value
      resolve()
    })
  },
  get(key) {
    return new Promise(resolve => {
      resolve(mem[key])
    })
  }
}

module.exports = redis
