const redis = require('./redis')
const Room = require('./algorithm/room')
async function dispatch(action) {
  if (action.roomid) {
    // room event
    try {
      let room = await redis.get(action.roomid)
      if (!room) {
        console.log(`room ${room.id} not exists`)
        return
      }
      room = await Room.reducer(room, action)
      await redis.set(room.id, room)
      return room
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = dispatch
