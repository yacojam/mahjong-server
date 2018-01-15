const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const MAX_USER = 4 // just for test
async function userJoin(room, user) {
  // already in
  if (room.users.findIndex(u => u.uid === user.uid) !== -1) {
    user.exit = false
    return room
  }
  if (room.users.length == room.players) {
    throw 'room full'
  }
  Object.assign(user, {
    shouPais: [],
    chuPais: [],
    pengPais: [],
    gangPais: [],
    anGangPais: [],
    exit: false
  })
  room.users.push(user)
  console.log(`user ${JSON.stringify(user)} join room ${JSON.stringify(room)}`)
  if (
    room.users.length == room.players
    // && room.users.every(user => user.state === states.STATE_USER_START) // todo
  ) {
    room = await startGame(room)
  }
  return room
}

async function startGame(room) {
  const pais = HXMJManager.getRandomPais()
  const userPais = HXMJManager.getUserPais(pais)
  room.users.forEach((user, idx) => {
    user.shouPais = userPais[idx]
    user.actions = [Action.makeupAction(Action.ACTION_DINGQUE, 0)]
  })
  room.leftPais = pais
  return room
}

module.exports = userJoin
