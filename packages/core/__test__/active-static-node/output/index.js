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
  render() {
    return (
      <View>
        {this.props.children}
        <View>
          <Text>456</Text>
        </View>
      </View>
    );
  }
}

class Demo extends React.Component {
  render() {
    const value = 123;
    return (
      <App>
        <Text>{value}</Text>
      </App>
    );
  }
}

export default Demo;
