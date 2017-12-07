import React, { Component } from "react";

import { List, ListItem } from "material-ui/List";
import Box, { VBox, Flex } from "react-layout-components";
import { RaisedButton, Card } from "material-ui";

const styles = {
  versionList: {
    fontSize: 22,
    borderRadius: 3,
    textAlign: "center",
    marginTop: 20
  }
};

export default class VersionList extends Component {
  render() {
    const { onPublishNew, onVersionChosen, versions, selected, creatingNew} = this.props;
    return (
      <VBox style={{ padding: "40px 20px", borderRight: "1px solid #eee" }}>
        <RaisedButton
          label="创建新版本"
          disabled={creatingNew}
          onClick={onPublishNew}
          primary={true}
        />
        <Card style={{ marginTop: 15, height: "100%" }}>
          <List style={{ width: 200, padding: 15 }}>
            {versions.map(item => {
              const isSelected =
                selected && item.versionCode === selected.versionCode;
              const itemStyle = Object.assign({}, styles.versionList, {
                border: isSelected ? "1px solid rgb(0, 188, 212)" : "none"
              });
              return (
                <ListItem
                  key={item.versionName}
                  primaryText={item.versionName}
                  style={itemStyle}
                  onClick={() => onVersionChosen(item)}
                />
              );
            })}
          </List>
        </Card>
      </VBox>
    );
  }
}
