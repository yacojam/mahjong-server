import React, { Component } from 'react'
import Action from '../../hxaction'

class DingQueAction extends Component {
  onClick = e => {
    const que = e.target.getAttribute('data-type')
    window.socket.emit('action', {
      type: Action.ACTION_DINGQUE,
      que
    })
  }
  render() {
    return (
      <div>
        <button data-type="1" onClick={this.onClick}>w</button>
        <button data-type="2" onClick={this.onClick}>b</button>
        <button data-type="3" onClick={this.onClick}>t</button>
      </div>
    )
  }
}
export default DingQueAction
