const actionTypes = require('./actiontypes')
const states = require('./states')

function create(uid, name) {
  return {
    uid,
    name,
    state: states.STATE_USER_INIT
  }
}

async function reducer(user, action) {
  const isSelf = user.uid == action.uid
  if (action.type === actionTypes.ACTION_ROOM_USER_START && isSelf) {
    user.state = states.STATE_USER_START
  }
}

module.exports = {
  create,
  reducer
}
