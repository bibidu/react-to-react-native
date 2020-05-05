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
  render() {
    const { activeStyle } = this.props;
    return (
      <View>
        <View style={_util.extend(activeStyle)}>
          <Text style={styles.$inherit1}>123</Text>
        </View>
      </View>
    );
  }
}

export default App;
