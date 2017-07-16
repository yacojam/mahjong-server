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
    const style = {
      zoom: 2
    }
    return (
      <div>
        <button style={style} data-type="1" onClick={this.onClick}>w</button>
        <button style={style} data-type="2" onClick={this.onClick}>b</button>
        <button style={style} data-type="3" onClick={this.onClick}>t</button>
      </div>
    )
  }
}
export default DingQueAction
