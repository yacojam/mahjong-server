const HXMJManager = require('../HxmjRules/HxmjManager')
const Action = require('../HxmjRules/hxaction')

async function dingque(action) {
  const { que, user, room } = action
  room.users.every(u => {
    if (u.uid === user.uid) {
      u.que = que
      return false
    }
    return true
  })

  const ready = room.users.every(u => !!u.que)

  if (ready) {
    // clear actions
    room.users.forEach(u => (u.actions = []))
    // test dealer action
    const dealer = room.users[0]
    dealer.actions = HXMJManager.getActions(
      dealer.shouPais,
      [],
      Action.ACTION_MO,
      dealer.shouPais[dealer.shouPais.length - 1]
    )
    dealer.actions.push(Action.makeupAction(Action.ACTION_CHU, 0))
  }

  return room
}

module.exports = dingque
