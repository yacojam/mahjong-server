const Game = require('./mahjong')
const actionTypes = require('./actiontypes')

function create(id) 
  return {
    id,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const uid = action.uid
    if (room.users.length == 4) {
      throw('room full')
    }
    if (room.users.indexOf(uid) != -1) {
      throw('user alreay in room')
    }
    room.users.push({
      uid
    })
  }

  if (action.type == actionTypes.ACTION_ROOM_USER_START) {
    const uid = action.uid 
  }
}

module.exports = {
  create,
  reducer
}
