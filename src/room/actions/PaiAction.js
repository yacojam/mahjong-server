import React, { Component } from 'react'
import Action from '../../hxaction'

class PaiAction extends Component {
  onClick = () => {
    const { pai, type } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_PENG,
      pai
    })
  }
  render() {
    const { pai, name } = this.props
    return (
      <button onClick={this.onClick}>
        {name}:{pai}
      </button>
    )
  }
}

export default PaiAction
