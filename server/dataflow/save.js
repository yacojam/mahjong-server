const store = require('./store')

async function save(action) {
  const { room, user } = action
  await store.setRoom(room.id, room)
  await store.setUserRoom(user.uid, room.id)
  // TODO persistent
}
