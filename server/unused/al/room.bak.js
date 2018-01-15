const Game = require('./mahjong')
const slice233 = require('./slice233')
const actionTypes = require('./actiontypes')
const states = require('./states')
const User = require('./user')
const MAX_USER = 2 // just for test

function create(id) {
  return {
    id,
    index: 0,
    game: null,
    users: [],
    state: actionTypes.ROOM_STATE_INIT
  }
}

async function reducer(room, action) {
  if (action.type === actionTypes.ACTION_ROOM_USER_JOIN) {
    const user = action.user || {
      uid: action._uid,
      name: action._uid
    }
    if (room.users.length == MAX_USER) {
      throw 'room full'
    }
    if (room.users.findIndex(user => user.uid == action._uid) != -1) {
      throw 'user alreay in room'
    }
    room.users.push(user)
    console.log(`user ${user} join room ${room}`)
    if (
      room.users.length == MAX_USER
      // && room.users.every(user => user.state === states.STATE_USER_START) // todo
    ) {
      // start game
      const game = new Game()
      const tiles = game.getTiles()
      // deal
      room.users.forEach(user => {
        user.tiles = tiles.splice(0, 13) // each 13 cards
      })
      const dealer = room.users[0]
      dealer.tiles.push(tiles.pop()) // dealer has 14 cards, start
      dealer.actions = ['chupai']

      room.leftTiles = tiles
    }

    if (action.type === actionTypes.ACTION_ROOM_USER_CHUPAI) {
      // check is valid
      if (
        !room.users.find(
          user =>
            user.actions.indexOf('chupai') !== -1 && user.uid === action._uid
        )
      ) {
        throw `user ${user.uid} cannot chupai`
      }
      const tile = action.tile
      // makeup each actions
      let hasChi = false
      let hasPeng = false
      let hasGang = false
      let hasHu = false
      room.users.forEach(user => {
        if (user.uid === action._uid) return
        user.actions = tileActions(user.tiles, tile)
        hasChi = hasChi || user.actions.indexOf('chi') !== -1
        hasPeng = hasPeng || user.actions.indexOf('peng') !== -1
        hasGang = hasGang || user.actions.indexOf('gang') !== -1
        hasHu = hasHu || user.actions.indexOf('hu') !== -1
      })

      // remove low priority action
      if (hasHu) {
      }
    }

    return room
  }

  return room
}

function tileActions(tiles, tile) {
  const actions = []
  const copy = tiles.slice(0).push(tile)
  if (canHu(copy)) {
    actions.push('hu')
  }
  if (canChi(tiles, tile)) {
    actions.push('chi')
  }
  if (canPeng(tiles, tile)) {
    actions.push('peng')
  }
  if (canGang(tiles, tile)) {
    actions.push('gang')
  }
  return actions
}

function canHu(tiles) {
  const wans = Game.getWans(tiles)
  const bings = Game.getBings(tiles)
  const tiaos = Game.getTiaos(tiles)
  const zis = Game.getZis(tiles)

  // console.log(wans, bings, tiaos, zis)

  const sliceWan = slice(wans)
  if (!sliceWan.is233) {
    return false
  }
  const sliceBing = slice(bings)
  if (!sliceBing.is233) {
    return false
  }
  const sliceTiao = slice(tiaos)
  if (!sliceTiao.is233) {
    return false
  }
  const sliceZi = slice(zis, false)
  if (!sliceZi.is233) {
    return false
  }
  let min2 = 0
  let max2 = 0
  let ss = [sliceWan, sliceBing, sliceTiao, sliceZi]
  console.log(JSON.stringify(ss, true, 2))
  ss.forEach(s => {
    min2 += s.min2
    max2 += s.max2
  })
  return min2 == 1 || max2 == 7 // 7 dui
}

function canChi(tiles, tile) {
  let can = false
  if (Game.isWan(tile)) {
    can = _canChi(Game.getWans(tiles), tile)
  }
  if (!can && Game.isBing(tile)) {
    can = _canChi(Game.getWans(tiles), tile)
  }
  if (!can && Game.isTiao(tile)) {
    can = _canChi(Game.getTiaos(tiles), tile)
  }
  return can
}

function canPeng(tiles, tile) {
  let cnt = 0
  tiles.forEach(t => {
    if (tile == t) {
      ++cnt
    }
  })
  return cnt >= 2
}

function canGang(tiles, tile) {
  let cnt = 0
  tiles.forEach(t => {
    if (tile == t) {
      ++cnt
    }
  })
  return cnt >= 3
}

function _canChi(tiles, tile) {
  return (
    (tiles.indexOf(tile - 2) !== -1 && tiles.indexOf(tile - 1) !== -1) ||
    (tiles.indexOf(-1) !== -1 && tiles.indexOf(tile + 1) !== -1) ||
    (tiles.indexOf(tile + 1) !== -1 && tiles.indexOf(tile + 2) !== -1)
  )
}

function slice(tiles, includeABC = true) {
  const ret = {
    is233: false,
    min2: 1000, // max enough
    max2: 0,
    result: []
  }
  if (tiles.length === 0) {
    ret.is233 = true
    ret.min2 = ret.max2 = 0
    return ret
  }
  const result = slice233(tiles, includeABC)
  if (result.length === 0) {
    ret.is233 = false
    return ret
  }

  // split ok
  result.forEach(slice => {
    let num2 = 0
    slice.forEach(s => {
      if (s.length == 2) {
        ++num2
      }
    })

    ret.min2 = Math.min(num2, ret.min2)
    ret.max2 = Math.max(num2, ret.max2)
  })
  ret.is233 = true
  ret.result = result
  return ret
}

module.exports = {
  create,
  reducer
}

module.exports.testCanHu = canHu
