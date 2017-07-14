import React, { Component } from 'react'
import Action from '../../hxaction'

class AnGangAction extends Component {
  onClick = () => {
    const { pai } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_ANGANG,
      pai
    })
  }
  render() {
    const { pai } = this.props
    return (
      <button onClick={this.onClick}>
        angang:{pai}
      </button>
    )
  }
}

export default AnGangAction
