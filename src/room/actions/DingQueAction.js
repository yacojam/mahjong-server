import React, { Component } from 'react'

const style = {
  padding: '2px 5px',
  margin: '2px'
}
class DingQueAction extends Component {
  render() {
    return (
      <div>
        <a style={style} href="#">万</a>
        <a style={style} href="#">饼</a>
        <a style={style} href="#">条</a>
      </div>
    )
  }
}
export default DingQueAction
