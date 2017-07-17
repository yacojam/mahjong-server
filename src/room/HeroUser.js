import React, { Component } from 'react'
import Tiles from './Tiles'
import PengTiles from './PengTiles'
import GangTiles from './GangTiles'
import ActionBar from './ActionBar'
import Action from '../hxaction'

class HeroUser extends Component {
  onExitClick = () => {
    window.socket.emit('action', {
      type: 'ACTION_USER_EXIT_ROOM'
    })
  }
  render() {
    const { user } = this.props
    const chupai =
      user.actions.findIndex(a => a.pAction === Action.ACTION_CHU) != -1
    return (
      <div>
        <div
          className="hero-chupais"
          style={{ height: window.pHeight + 5, zoom: '80%' }}
        >
          <Tiles tiles={user.chuPais} chupai={false} />
        </div>
        <div className="hero-shoupais">
          {user.pengPais.map(pai => <PengTiles key={pai} pai={pai} />)}
          {user.gangPais.map(pai => <GangTiles key={pai} pai={pai} />)}
          {user.anGangPais.map(pai => (
            <GangTiles key={pai} pai={pai} angang={true} />
          ))}
          <Tiles tiles={user.shouPais} chupai={chupai} />
        </div>
        <div className="hero-actions">
          <ActionBar actions={user.actions} />
        </div>
        <div>
          {user.uid} Que: {user.que}
        </div>
        <div>
          <button
            onClick={this.onExitClick}
            style={{ background: 'lightgray' }}
          >
            exit
          </button>
        </div>

      </div>
    )
  }
}

export default HeroUser