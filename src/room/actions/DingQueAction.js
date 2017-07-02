import React, { Component } from 'react'
import Action from '../../hxaction'

const style = {
  padding: '2px 5px',
  margin: '2px'
}
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
        <button data-type="wan" onClick={this.onClick}>万</button>
        <button data-type="bing" onClick={this.onClick}>饼</button>
        <button data-type="tiao" onClick={this.onClick}>条</button>
      </div>
    )
  }
}
export default DingQueAction
