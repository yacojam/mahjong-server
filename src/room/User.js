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
        <div style={{ border: '1px solid red', padding: 2 }}>
          chupai: <Tiles tiles={user.chuPais} chupai={false} />
          <br />
          peng: <Tiles tiles={user.pengPais} chupai={false} />
          gang: <Tiles tiles={user.gangPais} chupai={false} />
          angang: <Tiles tiles={user.anGangPais} chupai={false} />
        </div>
        <div>
          {user.shouPais
            ? <Tiles tiles={user.shouPais} chupai={chupai} />
            : null}
        </div>
        <div className="userActions">
          {dingque ? <DingQueAction /> : ''}
        </div>
      </div>
    )
  }
}

export default User
