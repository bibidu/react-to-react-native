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
      <>
        <View>
          <Text style={styles.$inherit1}>h1</Text>
        </View>
        <View>
          <Text style={styles.$inherit2}>h2</Text>
        </View>
        <View>
          <Text style={styles.$inherit3}>h3</Text>
        </View>
        <View>
          <Text style={styles.$inherit4}>h4</Text>
        </View>
        <View>
          <Text style={styles.$inherit5}>h5</Text>
        </View>
        <View>
          <Text style={styles.$inherit6}>h6</Text>
        </View>
      </>
    );
  }
}

export default App;
