const colors = require('colors')
const store = require('./store')

async function attach(action) {
  let rid = action.roomid || 0
  const uid = action._uid
  const userRoom = await store.getUserRoom(uid)
  if (userRoom && rid && rid != userRoom) {
    //  throw `user ${uid}'s room is ${userRoom}, but action room is ${rid}`
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
  action.user = (room && room.users.find(u => u.uid === uid)) || user
  // console.log('ATTACH'.green, JSON.stringify(action), '\n')
  // check action valid
  if (
    (action.type == 1 &&
      room.index !== room.users.findIndex(u => u.uid === user.uid)) ||
    (action.type >= 2 &&
      action.type <= 11 &&
      action.user.actions.findIndex(a => a.pAction === action.type) === -1)
  ) {
    throw `invalid actions ${JSON.stringify(action.user)}, action: ${action.type}`
  }
  return action
}

module.exports = attach
