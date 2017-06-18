const actions = [
  'ACTION_ROOM_USER_JOIN',
  'ACTION_ROOM_USER_LEFT',
  'ACTION_ROOM_USER_START',
  'ACTION_ROOM_START'
]

const actionMap = {}
actions.forEach(v => {
  actionMap[v] = v
})

module.exports = actionMap
