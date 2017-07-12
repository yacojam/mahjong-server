import React, { Component } from 'react'
import Action from '../../hxaction'

class WanGang extends Component {
  onClick = () => {
    const { pai } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_WGANG,
      pai
    })
  }

  render() {
    const { pai } = this.props
    return (
      <button onClick={this.onClick}>
        wangang: {pai}
      </button>
    )
  }
}

export default WanGang
