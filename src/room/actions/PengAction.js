import React, { Component } from 'react'
import Action from '../../hxaction'

class PengAction extends Component {
  onClick = () => {
    const { pai } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_PENG,
      pai
    })
  }

  render() {
    const { pai } = this.props
    return (
      <button onClick={this.onClick}>
        peng:{pai}
      </button>
    )
  }
}

export default PengAction
