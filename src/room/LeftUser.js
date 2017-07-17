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
          <span style={{ display: 'inline-block', marginRight: 10 }}>
            {user.uid}
          </span>
          <span style={{ display: 'inline-block', marginRight: 10 }}>
            ShouPais: {user.shouPais.length}<br />
          </span>
          <span style={{ display: 'inline-block', marginRight: 10 }}>
            Que:{user.que}
          </span>
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
