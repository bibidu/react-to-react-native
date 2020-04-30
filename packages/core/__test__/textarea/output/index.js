//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  TextInput
} from 'react-native'
import * as _util from './tools.js'
import styles from './stylesheet.js'

class App extends React.Component {
  render() {
    return (
      <TextInput
        onChangeText={e => console.log(_util.eventPolyfill(e).target.value)}
        onBlur={e => console.log("blur", _util.eventPolyfill(e).target.value)}
        autoFocus
        disabled
        maxLength={8}
        readOnly
        multiline
        style={styles.UITextarea}
      ></TextInput>
    );
  }
}

export default App;
