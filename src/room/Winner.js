import React, { Component } from 'react'
class Winner extends Component {
  render() {
    const { name, score } = this.props.user
    return (
      <div>
        {name} win <b>{score.join('/')}</b>
      </div>
    )
  }
}

export default Winner
