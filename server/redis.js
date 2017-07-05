/*
const Redis = require('ioredis')
const redis = new Redis()

*/
const fs = require('fs')
const path = require('path')
const cacheFile = path.join(__dirname, '../redis.cache')
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
      resolve(mem[key] || null)
    })
  },
  getAll() {
    return mem
  },
  save() {
    return new Promise((resolve, reject) => {
      fs.writeFile(cacheFile, JSON.stringify(mem, true, 2), error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  },
  load() {
    return new Promise(resolve => {
      fs.readFile(cacheFile, (error, data) => {
        if (error) {
          return resolve()
        }
        try {
          Object.assign(mem, JSON.parse(data.toString()))
          console.log(`redis loaded...`)
        } catch (e) {}
        resolve()
      })
    })
  }
}

module.exports = redis
