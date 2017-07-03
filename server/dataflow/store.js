const redis = require('../redis')

const PREFIX_ROOM = 'ROOM_'
const PREFIX_USER_TO_ROOM = 'USER_TO_ROOM_'
async function setRoom(rid, room) {
  await redis.set(PREFIX_ROOM + rid, room)
}

async function getRoom(rid) {
  return await redis.get(PREFIX_ROOM + rid)
}

async function setUserRoom(uid, rid) {
  await redis.set(PREFIX_USER_TO_ROOM + uid, rid)
}

async function getUserRoom(uid) {
  return await redis.get(PREFIX_USER_TO_ROOM + uid)
}

module.exports = {
  setRoom,
  getRoom,
  setUserRoom,
  getUserRoom
}
