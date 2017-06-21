import React, { Component } from 'react'

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
    if (chupai) {
      return (
        <a style={style} onClick={this.chupai} href="javascript:;">{tile}</a>
      )
    } else {
      return <span style={style}>{tile}</span>
    }
  }
}

export default Tile
