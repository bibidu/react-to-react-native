//
// Created by node lib `react-to-react-native`.
// 
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import * as _util from './tools.js'
import styles from './stylesheet.js'

class App extends React.Component {
  tapButton = e => {
    const { value } = e.target;
    console.log(`tap button ${value}`);
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={e => this.tapButton(_util.eventPolyfill(e))}>
          <Text>base event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ev =>
            this.tapButton({
              event: Object.assign(
                {},
                {
                  test: 123
                },
                () => {
                  t: _util.eventPolyfill(ev).currentTarget;
                }
              ),
              value: _util.eventPolyfill(ev)
            })
          }
        >
          <Text>complex event</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
