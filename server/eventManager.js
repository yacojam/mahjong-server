const redis = require('./redis')
const Room = require('./algorithm/room')
async function dispatch(action) {
  if (action.roomid) {
    // room event
    let room = await redis.get(room.id)
    if (!room) {
      console.log(`room ${room.id} not exists`)
      return
    }
    room = await Room.reducer(room, action)
    await redis.set(room.id, room)
    return room
  }
}

module.exports = dispatch
