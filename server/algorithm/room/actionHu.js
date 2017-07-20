const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')
const Pend = require('../HxmjRules/pendingtype')

function hu(action) {
  const { user, pai, room } = action
  const currentUser = room.users.find(u => u.uid === user.uid)
  const { pengPais, gangPais, anGangPais, shouPais, que } = currentUser
  let allChupais = []
  room.users.forEach(u => (allChupais = allChupais.concat(u.chuPais)))
  console.log(pengPais)
  const score = HXMJManager.getScore(
    pengPais,
    gangPais,
    anGangPais,
    shouPais,
    action.type,
    pai,
    allChupais,
    {},
    que
  )
  room.pendingType = Pend.PENDING_TYPE_NULL
  room.users.forEach(u => (u.actions = []))
  currentUser.score = score
  room.state = 'DONE'
  return room
}

module.exports = hu
