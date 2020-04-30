//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  Image
} from 'react-native'
import * as _util from './tools.js'
import styles from './stylesheet.js'

import wechatImg from "https://www.baidu.com/wechat.png";
import localImg from "./images/avatar.jpeg";

class App extends React.Component {
  render() {
    return (
      <View>
        <Image source={_util.imgPolyfill(wechatImg)}></Image>
        <Image source={_util.imgPolyfill(localImg)}></Image>
      </View>
    );
  }
}

export default App;
