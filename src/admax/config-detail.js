import React, { Component } from "react";
import Box, { VBox, Flex } from "react-layout-components";
import { RaisedButton, TextField, Toggle, IconButton } from "material-ui";

const styles = {
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
  detailItem: {
    marginTop: 30
  }
};

export default class ConfigDetail extends Component {
  constructor(props) {
    super();

    this.state = this.propsToState(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.propsToState(newProps));
  }

  propsToState(newProps) {
    const isNew = newProps && newProps.isNew;
    let newState;
    if (isNew) {
      newState = {
        versionName: "",
        versionX: 1,
        versionY: 0,
        versionZ: 0,
        tasteEnable: false,
        createTime: ""
      };
    } else {
      newState = Object.assign({}, newProps.detail);
    }
    return newState;
  }

  getConfig() {
    let {
      versionName,
      downloadUrl,
      serviceWeixin,
      tasteEnable,
      tasteAccount,
      createTime
    } = this.state;
    const cfg = {
      downloadUrl,
      serviceWeixin,
      tasteEnable,
      tasteAccount,
      createTime
    };
    if (this.props.isNew) {
      cfg.versionName = `v${this.state.versionX}.${this.state.versionY}.${
        this.state.versionZ
      }`;
    } else {
      cfg.versionCode = this.state.versionCode
      cfg.versionName = versionName;
    }

    if (cfg.tasteEnable) {
      cfg.tasteAccount = tasteAccount;
    }

    return cfg;
  }

  render() {
    const { isNew, onSubmit, onDelete } = this.props;
    const {
      versionName,
      downloadUrl,
      serviceWeixin,
      tasteEnable,
      tasteAccount,
      createTime
    } = this.state;

    return (
      <VBox style={{ padding: 40, flex: 1 }}>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>版本号(vX.Y.Z)</span>
          </Box>
          {isNew ? (
            <Box flex={2}>
              <TextField
                id="versionX"
                hintText="X"
                floatingLabelText="主版本"
                type="number"
                value={this.state.versionX || ""}
                style={styles.versionCode}
                onChange={(event, newValue) => {
                  this.setState({
                    versionX: newValue
                  });
                }}
              />
              <br />
              <TextField
                id="versionY"
                hintText="Y"
                type="number"
                value={this.state.versionY || ""}
                floatingLabelText="次版本"
                style={styles.versionCode}
                onChange={(event, newValue) => {
                  this.setState({
                    versionY: newValue
                  });
                }}
              />
              <br />
              <TextField
                id="versionZ"
                hintText="Z"
                type="number"
                value={this.state.versionZ || ""}
                floatingLabelText="修订号"
                style={styles.versionCode}
                onChange={(event, newValue) => {
                  this.setState({
                    versionZ: newValue
                  });
                }}
              />
              <br />
            </Box>
          ) : (
            <Box flex={2}>{versionName}</Box>
          )}
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>下载页面</span>
          </Box>
          <Box flex={2}>
            <TextField
              id="downloadUrl"
              hintText="http://downloadurl"
              value={downloadUrl || ""}
              onChange={(event, newValue) => {
                this.setState({
                  downloadUrl: newValue
                });
              }}
            />
            <br />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>客服微信号</span>
          </Box>
          <Box flex={2}>
            <TextField
              id="serviceWeixin"
              hintText="微信号"
              value={serviceWeixin || ""}
              onChange={(event, newValue) => {
                this.setState({
                  serviceWeixin: newValue
                });
              }}
            />
            <br />
          </Box>
        </Box>
        <Box style={styles.detailItem}>
          <Box flex={1}>
            <span style={styles.label}>开启体验模式</span>
          </Box>
          <Box flex={2}>
            <Toggle
              defaultToggled={tasteEnable}
              style={styles.toggle}
              onToggle={(event, toggled) => {
                this.setState({
                  tasteEnable: !tasteEnable
                });
              }}
            />
          </Box>
        </Box>
        {tasteEnable ? (
          <Box style={styles.detailItem}>
            <Box flex={1}>
              <span style={styles.label}>体验账号</span>
            </Box>
            <Box flex={2}>
              <TextField
                id="tasteAccount"
                value={tasteAccount || ""}
                onChange={(event, newValue) => {
                  this.setState({
                    tasteAccount: newValue
                  });
                }}
              />
            </Box>
          </Box>
        ) : (
          ""
        )}
        {isNew ? (
          ""
        ) : (
          <Box style={styles.detailItem}>
            <Box flex={1}>
              <span style={styles.label}>发布日期</span>
            </Box>
            <Box flex={2}>
              <label style={{ padding: 10 }}>{createTime}</label>
            </Box>
          </Box>
        )}
        <div
          style={Object.assign({}, styles.detailItem, {
            textAlign: 'center'
          })}
        >
          {isNew ? (
            ""
          ) : (
            <RaisedButton
              label="删除"
              secondary={true}
              style={{marginRight: 30}}
              onClick={onDelete}
            />
          )}
          <RaisedButton
            label={isNew ? "提交" : "保存"}
            primary={true}
            onClick={() => {
              onSubmit(this.getConfig());
            }}
          />
        </div>
      </VBox>
    );
  }
}
