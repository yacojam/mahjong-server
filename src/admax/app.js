import React, { Component } from "react";
import "./app.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  FlatButton,
  CircularProgress,
  IconButton,
  FontIcon,
  Menu,
  MenuItem
} from "material-ui";

import { VBox, Flex } from "react-layout-components";
import { Toolbar, ToolbarGroup } from "material-ui/Toolbar";
import AccountCircle from "material-ui/svg-icons/action/account-circle";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";

import VersionList from "./version-list";
import ConfigDetail from "./config-detail";
import Login from "./login";
import { getCookie } from "../utils";

const styles = {
  mask: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0, 0, 0.3)",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default class Admax extends Component {
  state = {};

  constructor() {
    super();
    document.title = "Admax";
  }

  handleLogout() {
    fetch("/admax/logout", {
      credentials: "include"
    })
      .then(rsp => rsp.json())
      .then(ret => {
        if (ret.code !== 0) {
          alert(ret.message);
          return;
        }
        localStorage.removeItem('login_user')

        this.setState({
          userData: null
        });
      });
  }

  render() {
    const { userData } = this.state;
    return (
      <MuiThemeProvider>
        {userData ? (
          <App userData={userData} onLogout={this.handleLogout.bind(this)}/>
        ) : (
          <Login
            onLogin={userData => {
              localStorage.setItem('login_user', userData.userid)

              this.setState({
                userData: userData
              });
            }}
          />
        )}
      </MuiThemeProvider>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.submitHandler = this._handleSubmit.bind(this);
    this.deleteHandler = this._handleDelete.bind(this);
    this.onTabChange = this._handleTabChange.bind(this);

    this.state = {
      currentTab: 1,
      newVersion: true,
      loading: true,
      versions: []
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    fetch("/admax/get_versions", {
      credentials: "include"
    })
      .then(rsp => rsp.json())
      .then(ret => {
        this.setState({
          loading: false
        });
        if (ret.code !== 0) {
          alert(ret.message);
          return;
        }
        const versions = ret.data || [];
        this.setState({ versions, newVersion: versions.length === 0 });
      });
  }

  _handleSubmit(data) {
    this.setState({
      loading: true
    });

    const { newVersion } = this.state;
    const url = newVersion ? "/admax/new_version" : "/admax/update_version";
    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      credentials: "include",
      body: JSON.stringify({
        config: data
      })
    })
      .then(rsp => rsp.json())
      .then(ret => {
        this.setState({
          loading: false
        });

        if (ret.code !== 0) {
          alert(ret.message);
          return;
        }
        const { versions } = this.state;
        const { data } = ret;
        if (newVersion) {
          versions.splice(0, 0, data);
        } else {
          const index = versions.findIndex(
            item => item.versionName === data.versionName
          );
          versions.splice(index, 1, data);
        }

        this.setState({
          newVersion: false,
          versions: versions,
          selectedVersion: data
        });
      });
  }

  _handleDelete() {
    this.setState({
      loading: true
    });

    const selected = this.state.selectedVersion;
    const versions = this.state.versions;
    fetch("/admax/delete_version", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      credentials: "include",
      body: JSON.stringify({
        versionCode: selected.versionCode
      })
    })
      .then(rsp => rsp.json())
      .then(ret => {
        this.setState({
          loading: false
        });
        if (ret.code !== 0) {
          alert(ret.message);
          return;
        }
        const index = this.state.versions.findIndex(
          item => item.versionCode === selected.versionCode
        );
        versions.splice(index, 1);

        this.setState({
          versions,
          selectedVersion: versions[0],
          newVersion: versions.length === 0
        });
      });
  }

  _handleTabChange(tabIndex) {
    this.setState({
      currentTab: tabIndex
    })
  }

  render() {
    const { userData } = this.props;
    const selectedStyle = { color: "white" };
    const { currentTab, versions, newVersion, loading } = this.state;
    let { selectedVersion } = this.state;
    if (!selectedVersion && !newVersion) {
      this.state.selectedVersion = versions[0];
      selectedVersion = this.state.selectedVersion;
    }

    return (
      <VBox style={{ width: "100%", height: "100%" }}>
        <Toolbar
          style={{
            backgroundColor: "rgb(0, 188, 212)",
            color: "rgba(0, 0, 0, 0.87)"
          }}
        >
          <ToolbarGroup firstChild={true}>
            <MenuItem
              value={1}
              primaryText="版本配置"
              style={currentTab === 1 ? selectedStyle : {}}
              onClick={()=>this.onTabChange(1)}
            />
            <MenuItem
              value={2}
              primaryText="用户管理"
              style={currentTab === 2 ? selectedStyle : {}}
              onClick={()=>this.onTabChange(2)}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <Menu>
              <MenuItem
                leftIcon={<AccountCircle />}
                primaryText={userData ? userData.username : "未登录"}
                targetOrigin={{ horizontal: "right", vertical: "bottom" }}
                menuItems={[
                  <MenuItem
                    leftIcon={<ExitToApp />}
                    primaryText="登出"
                    onClick={this.props.onLogout.bind(this)}
                  />
                ]}
              />
            </Menu>
          </ToolbarGroup>
        </Toolbar>
        {currentTab === 1 ? (
          <Flex>
            {loading ? (
              <div style={styles.mask}>
                <CircularProgress size={80} thickness={8} />
              </div>
            ) : (
              ""
            )}
            <VersionList
              versions={versions}
              creatingNew={newVersion}
              selected={selectedVersion}
              onVersionChosen={chosenOne => {
                this.setState({
                  selectedVersion: chosenOne
                });
              }}
              onPublishNew={() => {
                this.setState({
                  newVersion: true
                });
              }}
            />
            <ConfigDetail
              detail={selectedVersion}
              isNew={newVersion}
              onDelete={this.deleteHandler}
              onSubmit={this.submitHandler}
            />
          </Flex>
        ) : (
          <div />
        )}
      </VBox>
    );
  }
}
