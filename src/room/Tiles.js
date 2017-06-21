import React, { Component } from 'react'
import Tile from './Tile'

class Tiles extends Component {
  render() {
    console.log(this.props)
    const { actions, tiles } = this.props
    const chupai = actions && actions.indexOf('chupai') !== -1
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
