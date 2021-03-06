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
const wanStart = 11
const wanEnd = 19
const bingStart = 21
const bingEnd = 29
const tiaoStart = 31
const tiaoEnd = 39
const ziStart = 41
const ziEnd = 55
const huaStart = 61
const huaEnd = 68
const baidaStart = 71
const baidaEnd = 74
const baidaTile = 75
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
    const map = {
      41: '东',
      43: '南',
      45: '西',
      47: '北',
      51: '中',
      53: '发',
      55: '白'
    }
    return map[tile]
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
    return tiles.filter(Game.isWan)
  }
  static getBings(tiles) {
    return tiles.filter(Game.isBing)
  }
  static getTiaos(tiles) {
    return tiles.filter(Game.isTiao)
  }
  static getZis(tiles) {
    return tiles.filter(Game.isZi)
  }
  static isWan(tile) {
    return tile >= wanStart && tile <= wanEnd
  }
  static isBing(tile) {
    return tile >= bingStart && tile <= bingEnd
  }
  static isTiao(tile) {
    return tile >= tiaoStart && tile <= tiaoEnd
  }
  static isZi(tile) {
    return tile >= ziStart && tile <= ziEnd
  }
  static isHua(tile) {
    return tile >= huaStart && tile <= huaEnd
  }
  getTiles() {
    return this.tiles.slice(0)
  }
  getTile(end = false) {
    return end ? this.tiles.pop() : this.tiles.shift()
  }
}
module.exports = Game
