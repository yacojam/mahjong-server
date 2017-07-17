const store = require('./store')

async function save(action) {
  const { room, user } = action
  if (room) {
    await store.setRoom(room.id, room)
    await store.setUserRoom(user.uid, room.id)
  } else {
    await store.setUserRoom(user.uid, null)
  }
  // TODO persistent
}

module.exports = save
