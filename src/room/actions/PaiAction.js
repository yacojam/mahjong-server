import React, { Component } from 'react'
import Action from '../../hxaction'

class PaiAction extends Component {
  onClick = () => {
    const { pai, type } = this.props
    window.socket.emit('action', {
      type,
      pai
    })
  }
  render() {
    const { pai, name } = this.props
    return (
      <button
        style={{ zoom: '120%', backgroundColor: 'lightgray', margin: 5 }}
        onClick={this.onClick}
      >
        {name}:{pai}
      </button>
    )
  }
}

export default PaiAction
