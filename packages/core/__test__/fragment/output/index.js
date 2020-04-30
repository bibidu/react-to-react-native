//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  Text
} from 'react-native'

import styles from './stylesheet.js'

const { Fragment } = React;

function App() {
  return (
    <>
      <View>
        <Text>567</Text>
      </View>
    </>
  );
}

class ClassApp extends React.Component {
  render() {
    return (
      <>
        <View>
          <Text>123</Text>
        </View>
        <App>
          <>
            <View>
              <Text>444</Text>
            </View>
            <View>
              <Text>555</Text>
            </View>
          </>
        </App>
      </>
    );
  }
}

export default ClassApp;
