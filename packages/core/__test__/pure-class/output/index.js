//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  Text
} from 'react-native'

import styles from './stylesheet.js'

function App() {
  return (
    <View style={styles.UIDiv}>
      <View style={styles.UIDiv2}>
        <Text>123</Text>
      </View>
    </View>
  );
}

export default App;
