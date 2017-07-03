import React, { Component } from 'react'
import Tile from './Tile'

class Tiles extends Component {
  render() {
    console.log(this.props)
    const { chupai, tiles } = this.props
    return (
      <div>
        {tiles
          .sort((a, b) => a - b)
          .map((tile, idx) => <Tile key={idx} tile={tile} chupai={chupai} />)}
      </div>
    )
  }
}

export default Tiles
