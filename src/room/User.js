import React, { Component } from 'react'
import Tiles from './Tiles'
import Action from '../hxaction'
import DingQueAction from './actions/DingQueAction'
import PengAction from './actions/PengAction'

class User extends Component {
  render() {
    const { user } = this.props
    const isSelf = user.uid === window.uid
    const actions = user.actions
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
          {isSelf
            ? actions.map(a => {
                if (a.pAction === Action.ACTION_DINGQUE) {
                  return <DingQueAction key="dingque" />
                }
                if (a.pAction === Action.ACTION_PENG) {
                  return <PengAction pai={a.pai} key="peng" />
                }
              })
            : ''}
        </div>
      </div>
    )
  }
}

export default User
