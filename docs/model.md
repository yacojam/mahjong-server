# Model
平台: {
  rooms:[]
}

room: {
  users: [] 
  state: enum(init, start, end) // 有限状态机 
  cards: [] // 剩余cards
  ... // 已出掉的cards等房间信息
}

users: {
  info: {uid, name ...}
  cards: [] // cards in hands
  actions: [] // 可执行的操作 (hu, gang, peng, chupai)
  ...
}


