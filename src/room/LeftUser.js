import React, { Component } from 'react'
import Tiles from './Tiles'
import PengTiles from './PengTiles'
import GangTiles from './GangTiles'

class LeftUser extends Component {
  render() {
    const { user } = this.props
    return (
      <div>
        <div>
          ShouPais: {user.shouPais.length}<br />
          Que:{user.que}
        </div>
        <div>
          <Tiles tiles={user.chuPais} chupai={false} />
          {user.pengPais.map(pai => <PengTiles key={pai} pai={pai} />)}
          {user.gangPais.map(pai => <GangTiles key={pai} pai={pai} />)}
          {user.anGangPais.map(pai => (
            <GangTiles key={pai} pai={pai} angang={true} />
          ))}

        </div>
      </div>
    )
  }
}

export default LeftUser
