import React, { Component } from 'react'

class Login extends Component {
  state = {
    username: ''
  }
  onClick = () => {
    fetch('/setname', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username
      })
    })
      .then(rsp => rsp.json())
      .then(ret => {
        if (ret.code === 0) {
          window.location.reload()
        }
      })
  }

  onChange = e => {
    this.setState({ username: e.target.value })
  }

  render() {
    return (
      <div>
        <label>name: <input type="text" onChange={this.onChange} /></label>
        <button onClick={this.onClick}>Join</button>
      </div>
    )
  }
}

export default Login
