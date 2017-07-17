import React, { Component } from 'react'
import Action from '../hxaction'
// import Game from '../mahjong'

class Tile extends Component {
  chupai = () => {
    const { tile } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_CHU,
      pai: tile
    })
  }
  pai2img = pai => {
    let name
    if (pai >= 11 && pai <= 19) {
      // wan
      name = 'character_' + pai % 10
    }
    if (pai >= 21 && pai <= 29) {
      name = 'ball_' + pai % 10
    }
    if (pai >= 31 && pai <= 39) {
      name = 'bamboo_' + pai % 10
    }
    if (pai >= 41 && pai <= 55) {
      const map = {
        41: 'wind_east',
        43: 'wind_south',
        45: 'wind_west',
        47: 'wind_north',
        51: 'dragon_red',
        53: 'dragon_green',
        55: 'dragon_white'
      }
      name = map[pai]
    }
    return `/images/${name}.png`
  }
  render() {
    const { tile, chupai } = this.props
    const style = this.props.style || {
      margin: 1,
      width: window.pWidth,
      height: window.pHeight,
      margin: 1,
      border: '1px solid #ccc'
    }
    if (!chupai) {
    } else {
      style.borderColor = 'red'
    }
    /*
    const tileImg = (
      <img style={{ width: '40px' }} src={this.pai2img(tile)} alt={tile} />
    )
    */
    const tileImg = tile
    return (
      <button
        className="tile"
        style={style}
        onClick={this.chupai}
        disabled={chupai ? '' : 'disabled'}
      >
        {tileImg}
      </button>
    )
  }
}

export default Tile
