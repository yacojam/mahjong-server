const actionTypes = require('../actiontypes')
const paiAction = require('../HxmjRules/hxaction')
const states = require('../states')
const User = require('../user')

const handleUserJoinRoom = require('./actionUserJoin')

function create(id) {
  return {
    id,
    index: 0,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const user = action.user || {
      uid: action._uid,
      name: action._uid
    }
    room = handleUserJoinRoom(room, user)
  }

  if (action.type === paiAction.ACTION_DINGQUE) {
    // do dinq que
  }

  return room
}

module.exports = {
  create,
  reducer
}
