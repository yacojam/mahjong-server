import React, { Component } from "react";
import "./app.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField, Toggle, IconButton } from "material-ui";
import { List, ListItem } from "material-ui/List";
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

const styles = {
  block: {
    maxWidth: 250
  },
  toggle: {
    width: "auto",
    marginTop: 15,
    marginBottom: 15
  },
  versionCode: {
    width: 60,
    marginRight: 30
  },
  label: {
    paddingLeft: 30,
    width: 200,
    margin: "auto 0"
  },
  versionList: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 20
  },
  detailItem: {
    marginTop: 30
  }
};

export default class Admax extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <VBox style={{ width: "100%", height: "100%" }}>
          <Toolbar>
            <ToolbarGroup firstChild={true}>
              <DropDownMenu value={1} onChange={this.handleChange}>
                <MenuItem value={1} primaryText="版本配置" />
                <MenuItem value={2} primaryText="用户操作" />
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup>
              <IconButton iconClassName="fa fa-user" />
            </ToolbarGroup>
          </Toolbar>
          <Flex>
            <VersionList />
            <ConfigDetail />
          </Flex>
        </VBox>
      </MuiThemeProvider>
    )
  }
}

class VersionList extends Component {
  render() {
    return (
      <VBox style={{ padding: 20, borderRight: "1px solid #eee" }}>
        <RaisedButton
          label="发布新版本"
          styles={{ marginBottom: 15 }}
        />
        <List style={{ width: 200, height: "100%" }}>
          <ListItem primaryText="1.0.0" style={styles.versionList} />
          <ListItem primaryText="1.1.0" style={styles.versionList} />
          <ListItem primaryText="1.1.2" style={styles.versionList} />
          <ListItem primaryText="1.1.3" style={styles.versionList} />
          <ListItem primaryText="2.1.0" style={styles.versionList} />
        </List>
      </VBox>
    );
  }
}

class ConfigDetail extends Component {
  render() {
    return (
      <VBox style={{ padding: 40, flex: 1 }}>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>版本号(vX.Y.Z)</span>
          </Box>
          <Box flex={2}>
            <TextField
              hintText="X"
              floatingLabelText="主版本"
              type="number"
              style={styles.versionCode}
            />
            <br />
            <TextField
              hintText="Y"
              type="number"
              floatingLabelText="次版本"
              style={styles.versionCode}
            />
            <br />
            <TextField
              hintText="Z"
              type="number"
              floatingLabelText="修订号"
              style={styles.versionCode}
            />
            <br />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>下载页面</span>
          </Box>
          <Box flex={2}>
            <TextField hintText="http://downloadurl" />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>客服微信号</span>
          </Box>
          <Box flex={2}>
            <TextField hintText="微信号" />
            <br />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>开启体验模式</span>
          </Box>
          <Box flex={2}>
            <Toggle defaultToggled={true} style={styles.toggle} />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>体验账号</span>
          </Box>
          <Box flex={2}>
            <TextField />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>发布日期</span>
          </Box>
          <Box flex={2}>
            <label style={{ padding: 10 }}>2017-12-1</label>
          </Box>
        </Box>
        <Box style={{...styles.detailItem, flexDirection: 'column', alignItems: 'center'}}>
          <RaisedButton
            label="保存"
            primary={true}
          />
        </Box>
      </VBox>
    );
  }
}
