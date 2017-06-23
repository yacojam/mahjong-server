function pickAA(tiles) {
  if (tiles.length >= 2 && tiles[0] === tiles[1]) {
    return [tiles.slice(0, 2), tiles.slice(2)]
  }
  return null
}

function pickAAA(tiles) {
  if (tiles.length >= 3 && tiles[0] === tiles[1] && tiles[0] === tiles[2]) {
    return [tiles.slice(0, 3), tiles.slice(3)]
  }
  return null
}

function pickABC(tiles) {
  if (tiles.length < 3) {
    return null
  }
  const start = tiles[0]
  let cnt = 0
  const picks = []
  const left = []
  tiles.forEach(t => {
    if (cnt < 3 && t === start + cnt) {
      picks.push(t)
      ++cnt
    } else {
      left.push(t)
    }
  })
  if (cnt === 3) {
    return [picks, left]
  }
  return null
}

function slice233(tiles) {
  const rets = []
  function slice(tiles, results) {
    if (tiles.length === 0) {
      rets.push(results)
    }
    let slices
    if ((slices = pickAA(tiles)) !== null) {
      const [aa, left] = slices
      const copy = results.slice(0)
      copy.push(aa)
      slice(left, copy)
    }
    if ((slices = pickAAA(tiles)) !== null) {
      const [aaa, left] = slices
      const copy = results.slice(0)
      copy.push(aaa)
      slice(left, copy)
    }
    if ((slices = pickABC(tiles)) !== null) {
      const [abc, left] = slices
      const copy = results.slice(0)
      copy.push(abc)
      slice(left, copy)
    }
  }
  slice(tiles, [])
  return rets
}

module.exports = slice233
// test
/*
let arr
arr = pickAA(tiles)
console.log(arr)

arr = pickAAA(tiles)
console.log(arr)

arr = pickABC(tiles)
console.log(arr)

function test(input) {
  const tiles = []
  for (let i = 0; i != input.length; ++i) {
    tiles[i] = parseInt(input[i])
  }
  console.log(tiles)
  slice(tiles, [])
}

let input = '11223344556677'
input = '11122233344'
test(input)
*/
