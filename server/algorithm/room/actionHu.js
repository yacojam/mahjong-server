const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')

function hu(action) {
  const { user, pai, room } = action
  const currentUser = room.users.find(u => u.uid === user.uid)
  const { pengPais, gangPais, anGangPais, shouPais } = currentUser
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
    {}
  )

  room.users.forEach(u => (u.actions = []))
  currentUser.score = score
  room.state = 'DONE'
  return room
}

module.exports = hu
