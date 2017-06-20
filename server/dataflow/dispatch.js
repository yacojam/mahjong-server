const redis = require('../redis')
const Room = require('../algorithm/room')
async function dispatch(action) {
  if (action.roomid) {
    // room event
    let room = await redis.get(action.roomid)
    if (!room) {
      throw `room ${action.roomid} not exists`
    }
    room = await Room.reducer(room, action)
    await redis.set(room.id, room)
    return room
  }
}

module.exports = dispatch
