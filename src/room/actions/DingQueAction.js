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
        <button data-type="wan" onClick={this.onClick}>w</button>
        <button data-type="bing" onClick={this.onClick}>b</button>
        <button data-type="tiao" onClick={this.onClick}>t</button>
      </div>
    )
  }
}
export default DingQueAction
