import React, { Component } from 'react'
import Game from '../mahjong'

class Tile extends Component {
  chupai = () => {
    const { tile } = this.props
    console.log('chupai', tile)
  }
  render() {
    const { tile, chupai } = this.props
    const style = {
      padding: 5
    }
    console.log(tile, Game.render(tile))
    const tileImg = Game.render(tile) + '(' + tile + ')'
    if (chupai) {
      return (
        <a style={style} onClick={this.chupai} href="#">
          {tileImg}
        </a>
      )
    } else {
      return <span style={style}>{tileImg}</span>
    }
  }
}

export default Tile
