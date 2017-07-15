import React, { Component } from 'react'
import Action from '../../hxaction'

class GangShangHuaAction extends Component {
  onClick = () => {
    const { pai } = this.props
    window.socket.emit('action', {
      type: Action.ACTION_GSHUA,
      pai
    })
  }
  render() {
    const { pai } = this.props
    return (
      <button onClick={this.onClick}>
        gangshanghua:{pai}
      </button>
    )
  }
}
export default GangShangHuaAction
