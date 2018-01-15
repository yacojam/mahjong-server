const store = require('./store')
const Room = require('../algorithm/room')
async function dispatch(action) {
  let room = action.room
  room = await Room.reducer(room, action)
  action.room = room
  return room
}

module.exports = dispatch
