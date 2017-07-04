import React, { Component } from 'react'
import Tiles from './Tiles'
import Action from '../hxaction'
import DingQueAction from './actions/DingQueAction'

class User extends Component {
  render() {
    const { user } = this.props
    const actions = user.actions
    const dingque =
      actions.findIndex(action => action.pAction === Action.ACTION_DINGQUE) !==
      -1
    const chupai =
      actions.findIndex(action => action.pAction === Action.ACTION_CHU) !== -1
    console.log(Action)

    return (
      <div>
        <div>
          {user.name}
        </div>
        {user.shouPais ? <Tiles tiles={user.shouPais} chupai={chupai} /> : null}
        <div className="userActions">
          {dingque ? <DingQueAction /> : ''}
        </div>
      </div>
    )
  }
}

export default User
