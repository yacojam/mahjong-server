const colors = require('colors')
const user2ws = require('../socket/user2ws')

async function publish(error, room, action) {
  console.log('PUBLISH'.green, error, JSON.stringify(room), '\n')
  room.users.forEach(user => {
    user2ws.sendMessage(user.uid, {
      error: error ? error.message || error.toString() : null,
      data: room
    })
  })
}

module.exports = publish
