import React, { Component } from 'react'

class Messages extends Component {
  render() {
    const messages = this.props.messages
    return (
      <ul>
        {messages.map(msg => (
          <li key={msg.date.getTime()}>
            <div>{msg.date.getTime()}</div>
            <div>{JSON.stringify(msg.data)}</div>
          </li>
        ))}
      </ul>
    )
  }
}

export default Messages
