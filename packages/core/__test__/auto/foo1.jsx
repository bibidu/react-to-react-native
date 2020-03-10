//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text
} from 'react-native'
import * as rnUtils from './rnUtils.js'
import stylesheet from './stylesheet.js'

class Black extends React.Component {
  render() {
    return (
      <View style={stylesheet["unique_id8"]}>
        <Text
          style={rnUtils.extractInheritStyleName(...[stylesheet["unique_id8"]])}
        >
          Black
        </Text>
      </View>
    );
  }
}

export default Black;
