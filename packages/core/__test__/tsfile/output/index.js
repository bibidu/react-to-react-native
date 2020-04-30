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
  constructor() {
    super(...arguments);
    this.state = {
      count: 1
    };
  }

  render() {
    return (
      <View>
        <Text>ts file</Text>
      </View>
    );
  }
}

export default App;
