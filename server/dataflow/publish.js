const user2ws = require('../socket/user2ws')

async function publish(error, data, action) {
  console.log('PUBLISH', error, data, action)
  if (action.roomid) {
    const room = data
    room.users.forEach(user => {
      user2ws.sendMessage(user.uid, {
        error: error ? error.message || error.toString() : null,
        data
      })
    })
  } else {
    const uid = action._uid
    user2ws.sendMessage(uid, {
      error: error ? error.message || error.toString() : null,
      data
    })
  }
}

module.exports = publish
