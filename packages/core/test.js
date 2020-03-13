const ReactToReactNative = require('./app')

const COMPONENT_NAME = 'Toast'

new ReactToReactNative()
  .init({
    entryPath: `/Users/mr.du/Desktop/bibidu/react-to-react-native/packages/components/template/src/${COMPONENT_NAME}/index.js`,
    exportPath: `/Users/mr.du/Desktop/AwesomeReactNativeProject/auto/index.js`,
  }).start()