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

const H1 = () => (
  <View style={stylesheet["unique_id1"]}>
    <Text
      style={rnUtils.extractInheritStyleName(...[stylesheet["unique_id1"]])}
    >
      h1
    </Text>
  </View>
);

const H2 = () => (
  <View style={stylesheet["unique_id3"]}>
    <Text
      style={rnUtils.extractInheritStyleName(...[stylesheet["unique_id3"]])}
    >
      h2
    </Text>
  </View>
);

const App = () => {
  return (
    <>
      <H1 />
      <H2 />
    </>
  );
};

export default App;
