const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const utils = require('./utils')
const Pend = require('../HxmjRules/pendingtype')

async function gang(action, anGang = false) {
  const { user, room, pai } = action
  user.actions = []
  if (anGang) {
    user.shouPais = utils.removePai(user.shouPais, pai, 4)
    user.anGangPais.push(pai)
  } else {
    user.shouPais = utils.removePai(user.shouPais, pai, 3)
    user.gangPais.push(pai)
    room.users[room.index].chuPais.pop()
  }
  room.index = room.users.findIndex(u => u.uid === user.uid)
  room.pendingType = Pend.PENDING_TYPE_NULL
  await utils.moAction(room, Action.ACTION_GMO)
  return room
}

module.exports = gang
