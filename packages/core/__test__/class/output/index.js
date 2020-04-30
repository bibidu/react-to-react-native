//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  Text
} from 'react-native'

import styles from './stylesheet.js'

class App extends React.Component {
  state = {};

  render() {
    return (
      <View style={styles.UIDiv}>
        <Text>base class</Text>
      </View>
    );
  }
}

export default App;
