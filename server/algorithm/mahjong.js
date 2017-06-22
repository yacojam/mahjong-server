/*
 * 万：一~九万，9个各4张 [1-9]
 * 筒(饼)：一~九筒，9个各4张 [11-19]
 * 条(索)：一~九条，9个各4张 [21-29]
 * 字牌: 东南西北中发白，7个各4张 [31 - 37]
 * 花牌：春夏秋冬梅兰竹菊，8个各1张 [41 - 48]
 * 百搭牌：财神，猫，老鼠，聚宝盆各1张 [51 - 54]
 * 百搭牌4张 [55]
 */ ////
const cnNumber = '一二三四五六七八九'
const ziTiles = '东南西北中发白'
const huaTiles = '春夏秋冬梅兰竹菊'
const baidaTiles = ['财神', '猫', '老鼠', '聚宝盆', '百搭']
const wanStart = 1
const wanEnd = 9
const bingStart = 11
const bingEnd = 19
const tiaoStart = 21
const tiaoEnd = 29
const ziStart = 31
const ziEnd = 37
const huaStart = 41
const huaEnd = 48
const baidaStart = 51
const baidaEnd = 54
const baidaTile = 55
function getCnNumber(num) {
  return cnNumber[num - 1]
}
function render(tile) {
  if (tile >= wanStart && tile <= wanEnd) {
    return getCnNumber(tile % 10) + '万'
  }
  if (tile >= bingStart && tile <= bingEnd) {
    return getCnNumber(tile % 10) + '饼'
  }
  if (tile >= tiaoStart && tile <= tiaoEnd) {
    return getCnNumber(tile % 10) + '条'
  }
  if (tile >= ziStart && tile <= ziEnd) {
    return ziTiles[tile % 10 - 1]
  }
  if (tile >= huaStart && tile <= huaEnd) {
    return huaTiles[tile % 10 - 1]
  }
  if (tile >= baidaStart && tile <= baidaEnd) {
    return baidaTiles[tile % 10 - 1]
  }
  if (tile == baidaTile) {
    return '百搭'
  }
  return null
}
function allTiles(
  opts = {
    hasZi: true,
    hasHua: true,
    hasBaida: false
  }
) {
  const tiles = []
  for (let cnt = 0; cnt < 4; ++cnt) {
    for (let i = wanStart; i <= wanEnd; ++i) {
      tiles.push(i)
    }
    for (let i = bingStart; i <= bingEnd; ++i) {
      tiles.push(i)
    }
    for (let i = tiaoStart; i <= tiaoEnd; ++i) {
      tiles.push(i)
    }
    if (opts.hasZi) {
      for (let i = ziStart; i <= ziEnd; ++i) {
        tiles.push(i)
      }
    }
    if (opts.hasBaida) {
      tiles.push(baidaTiles)
    }
  } // 花
  if (opts.hasHua) {
    for (let i = huaStart; i <= huaEnd; ++i) {
      tiles.push(i)
    }
  }
  if (opts.hasBaida) {
    for (let i = baidaStart; i <= bingEnd; ++i) {
      tiles.push(i)
    }
  }
  return tiles
}
function shuffle(tiles) {
  return tiles.sort(() => Math.random() - 0.5)
}
class Game {
  constructor(opts) {
    this.tiles = shuffle(allTiles(opts))
  }
  static render(tile) {
    return render(tile)
  }
  static getWans(tiles) {
    return tiles.filter(tile => tile >= wanStart && tile <= wanEnd)
  }
  static getBings(tiles) {
    return tiles.filter(tile => tile >= bingStart && tile <= bingEnd)
  }
  static getZis(tiles) {
    return tiles.filter(tile => tile >= ziStart && tile <= ziEnd)
  }
  getTiles() {
    return this.tiles.slice(0)
  }
  getTile(end = false) {
    return end ? this.tiles.pop() : this.tiles.shift()
  }
}
module.exports = Game
