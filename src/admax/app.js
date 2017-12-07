import React, { Component } from "react";
import "./app.css";
import "../iconfont/material-icons.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { FlatButton, TextField, Toggle, IconButton } from "material-ui";

import Box, { VBox, Flex } from "react-layout-components";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import IconMenu from "material-ui/IconMenu";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";

import VersionList from "./version-list";
import ConfigDetail from "./config-detail";

export default class Admax extends Component {
  constructor() {
    super();

    document.title = "Admax";

    this.menuHandler = this._handleMenuClick.bind(this);
    this.accountHandler = this._handleAccountMenu.bind(this);
    this.submitHandler = this._handleSubmit.bind(this);

    this.state = {
      currentTab: 1,
      newVersion: true,
      versions: []
    };
  }

  componentDidMount() {
    fetch("/admax/get_versions")
      .then(rsp => rsp.json())
      .then(ret => {
        if (ret.code !== 0) {
          alert(ret.message);
          return;
        }
        const versions = ret.data || [];
        this.setState({ versions, newVersion: versions.length === 0 });
      });
  }

  _handleSubmit(data) {
    const {newVersion} = this.state
    const url = newVersion ? "/admax/new_version" : "/admax/_version"
    fetch(url,  {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            config: data
        })
    })
    .then(rsp => rsp.json())
    .then(ret => {
      if (ret.code !== 0) {
        alert(ret.message);
        return;
      }
      const {versions} = this.state
      const {data} = ret
      if (newVersion) {
        versions.splice(0, 0, data )
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

  _handleMenuClick() {}

  _handleAccountMenu() {}

  render() {
    const selectedStyle = { color: "white" };
    const { currentTab, versions, newVersion } = this.state;
    let { selectedVersion } = this.state;
    if (!selectedVersion && !newVersion) {
      selectedVersion = versions[0];
    }

    return (
      <MuiThemeProvider>
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
                onClick={this.menuHandler}
              />
              <MenuItem
                value={2}
                primaryText="用户管理"
                style={currentTab === 2 ? selectedStyle : {}}
                onClick={this.menuHandler}
              />
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton
                label="未登录"
                icon={
                  <FontIcon className="material-icons">account_circle</FontIcon>
                }
              />
            </ToolbarGroup>
          </Toolbar>
          {currentTab === 1 ? (
            <Flex>
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
                onSubmit={this.submitHandler}
              />
            </Flex>
          ) : (
            <div />
          )}
        </VBox>
      </MuiThemeProvider>
    );
  }
}
