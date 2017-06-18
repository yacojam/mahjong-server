const Game = require('./mahjong')
const actionTypes = require('./actiontypes')
const states = require('./states')
const User = require('./user')
const dispatch = require('../eventManager')

function create(id) {
  return {
    id,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  // apply user reducer
  await Promise.all(room.users.map(user => User.reducer(user, action)))

  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const user = action.user
    if (room.users.length == 4) {
      throw 'room full'
    }
    if (room.users.indexOf(user.uid) != -1) {
      throw 'user alreay in room'
    }
    room.users.push(user)
    return room
  }

  if (action.type == actionTypes.ACTION_ROOM_USER_START) {
    if (
      room.users.length == 4 &&
      room.users.every(user => user.state === states.STATE_USER_START)
    ) {
      dispatch({
        roomid: room.id,
        type: actionTypes.ACTION_ROOM_START
      })
    }
  }

  return room
}

module.exports = {
  create,
  reducer
}
