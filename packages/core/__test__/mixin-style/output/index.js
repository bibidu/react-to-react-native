//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  Text
} from 'react-native'
import * as _util from './tools.js'
import styles from './stylesheet.js'

class App extends React.Component {
  activeCls = type => `${type}-btn`;
  activeStyle = type => ({
    padding: type ? "15px" : "20px",
    border: "1px solid #ccc"
  });

  render() {
    const { type } = this.props;
    const defaultStyle = {
      marginTop: 5
    };
    const activeWrapper = "abc";
    return (
      <View UI="UIDiv" style={styles.$merge1}>
        <View
          UI="UIDiv2"
          style={[
            styles.$merge2,
            _util.extend(styles[`${this.activeCls(type)}`]),
            _util.extend(styles[`${activeWrapper}`]),
            _util.extend(Object.assign(defaultStyle, this.activeStyle(type)))
          ]}
        >
          <Text UI="UISpan" style={styles.$inherit3}>
            123
          </Text>
        </View>
      </View>
    );
  }
}

export default App;
