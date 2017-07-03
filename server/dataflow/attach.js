const store = require('./store')

async function attach(action) {
  let rid = action.roomid || 0
  const uid = action._uid
  const userRoom = await store.getUserRoom(uid)
  if (userRoom && rid && rid != userRoom) {
    throw `user ${uid}'s room is ${userRoom}, but action room is ${rid}`
  } else if (userRoom) {
    rid = userRoom
  }

  const room = await store.getRoom(rid)
  if (!room) {
    throw `room ${rid} not exists`
  }
  // TODO fill user info
  // const user = store.getUserInfo(uid)
  const user = {
    uid,
    name: uid,
    actions: []
  }
  action.room = room
  action.user = user
  console.log('ATTACH', action)
  return action
}

module.exports = attach
