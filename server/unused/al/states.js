const states = [
  'STATE_USER_INIT',
  'STATE_USER_START',
  'STATE_ROOM_INIT',
  'STATE_ROOM_START'
]

const stateMap = {}
states.forEach(v => {
  stateMap[v] = v
})

module.exports = stateMap
