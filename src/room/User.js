import React, { Component } from 'react'
import Tiles from './Tiles'
import Action from '../hxaction'
import DingQueAction from './actions/DingQueAction'

class User extends Component {
  render() {
    const { user } = this.props
    const isSelf = user.uid === window.uid
    const actions = user.actions
    const dingque =
      actions.findIndex(action => action.pAction === Action.ACTION_DINGQUE) !==
      -1
    const chupai =
      actions.findIndex(action => action.pAction === Action.ACTION_CHU) !== -1

    const style = isSelf
      ? {
          color: 'green'
        }
      : {
          color: '#666'
        }

    return (
      <div style={style}>
        <div>
          {isSelf ? <b>{user.name}</b> : user.name}
        </div>
        <div style={{ padding: 2 }}>
          chupai: <Tiles tiles={user.chuPais} chupai={false} />
          <br />
          peng: <Tiles tiles={user.pengPais} chupai={false} />
          gang: <Tiles tiles={user.gangPais} chupai={false} />
          angang: <Tiles tiles={user.anGangPais} chupai={false} />
        </div>
        <div>
          {user.shouPais
            ? <Tiles tiles={user.shouPais} chupai={isSelf && chupai} />
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
