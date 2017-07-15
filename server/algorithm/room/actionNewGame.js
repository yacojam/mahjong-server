const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const MAX_USER = 2 // just for test
async function newGame(action) {
  const { user, room } = action
  user.state = 'STATE_USER_START'
  if (room.users.every(u => u.state === 'STATE_USER_START')) {
    room.users.forEach(u => (u.state = null))
    await utils.startGame(room)
  }
  return room
}

module.exports = newGame
