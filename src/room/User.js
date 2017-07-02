import React, { Component } from 'react'

class User extends Component {
  render() {
    const { user } = this.props
    return (
      <div>
        <div>
          {user.name}
        </div>
        {user.shouPais
          ? <Tiles tiles={user.shouPais} actions={user.actions} />
          : null}
      </div>
    )
  }
}

export default User
