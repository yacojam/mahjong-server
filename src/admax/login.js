import React, { Component } from "react";
import Box, { VBox, Flex, Center } from "react-layout-components";
import {
  RaisedButton,
  TextField,
  Card,
  CardTitle,
  CardActions,
  CircularProgress
} from "material-ui";

const styles = {
  label: {
    paddingLeft: 10,
    width: 150,
    fontSize: 24,
    margin: "auto 0"
  },
  row: {
    margin: 30
  },
  input: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 22
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loginHandler = this.login.bind(this);
  }

  componentDidMount() {
    const userid = localStorage.getItem('login_user')
    if (!userid) {
      return
    }
    
    this.setState({
      logining: true
    })
    fetch("/admax/quick_login", {
      credentials: "include",
    })
      .then(rsp => rsp.json())
      .then(rsp => {
        this.setState({
          logining: false
        })

        if (rsp.code !== 0) {
          alert(rsp.message);
          return;
        }

        this.props.onLogin(rsp.data)
      });
  }

  login() {
    this.setState({
      logining: true
    })
    fetch("/admax/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      credentials: "include",
      body: JSON.stringify({
        username: this.state.username,
        passwd: this.state.passwd
      })
    })
      .then(rsp => rsp.json())
      .then(rsp => {
        this.setState({
          logining: false
        })

        if (rsp.code !== 0) {
          alert(rsp.message);
          return;
        }

        this.props.onLogin(rsp.data)
      });
  }

  render() {
    const { username, passwd, logining } = this.state;
    return (
      <Center
        style={{ width: "100%", height: "100%", backgroundColor: "#eee" }}
      >
        <Card style={{ padding: 20, width: 600, height: 350, marginTop: -200 }}>
          <CardTitle
            title="请登录您的Admax账号"
            titleColor="rgb(0, 188, 212)"
          />
          <Box style={styles.row}>
            <Box flex={1}>
              <span style={styles.label}>用户名：</span>
            </Box>
            <Box flex={3}>
              <TextField
                id="username"
                type="text"
                fullWidth={true}
                disabled={logining}
                value={username || ""}
                inputStyle={styles.input}
                onChange={(event, newValue) => {
                  this.setState({
                    username: newValue
                  });
                }}
              />
              <br />
            </Box>
          </Box>
          <Box style={styles.row}>
            <Box flex={1}>
              <span style={styles.label}>密码：</span>
            </Box>
            <Box flex={3}>
              <TextField
                id="passwd"
                type="password"
                fullWidth={true}
                disabled={logining}
                value={passwd || ""}
                inputStyle={styles.input}
                onChange={(event, newValue) => {
                  this.setState({
                    passwd: newValue
                  });
                }}
              />
              <br />
            </Box>
          </Box>
          <CardActions style={{ float: "right" }}>
                {
                  logining ? <CircularProgress size={30} thickness={4} style={{paddingLeft: 20, paddingRight: 20}}/> 
                    : <RaisedButton
                  label="登录"
                  primary={true}
                  onClick={this.loginHandler}
                />
                }
          </CardActions>
        </Card>
      </Center>
    );
  }
}
