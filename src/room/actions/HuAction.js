import React, { Component } from 'react'

class HuAction extends Component {
  onClick = () => {
    const { pai, type } = this.props
    window.socket.emit('action', {
      type,
      pai
    })
  }
  render() {
    const { pai } = this.props
    return <button onClick={this.onClick}>hu {pai}</button>
  }
}

export default HuAction
