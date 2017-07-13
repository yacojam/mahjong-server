import React, { Component } from 'react'
import Action from '../../hxaction'

class GangAction extends Component {
  onClick = () => {
    const { pai } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_PGANG,
      pai
    })
  }

  render() {
    const { pai } = this.props
    return (
      <button onClick={this.onClick}>
        gang:{pai}
      </button>
    )
  }
}
export default GangAction
