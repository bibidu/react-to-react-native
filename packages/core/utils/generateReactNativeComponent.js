const prettier = require('prettier')

module.exports = function generateReactNativeComponent({
  fileType,
  usingComponent,
  code,
}) {
  function genUsingComponentCode(usingComponent) {
    const componentStr = (usingComponent || []).join(',\n  ')
    return `import {
  AppRegistry,
  StyleSheet,
  ${componentStr}\n} from 'react-native'`
  }
  
  function genStyleSheet(finalStyleObject) {
    return `import ${this.enums.STYLESHEET_NAME} from './${this.enums.STYLESHEET_FILE_NAME}.js'`
  }

  function genTopBanner() {
    return `//
// Created by node lib \`react-to-react-native\`.
// `
  }

  function formatCode(code) {
    const formatConfig = {
      jsxBracketSameLine: false,
      tabWidth: 2,
      parser: 'babel',
    }
    return prettier.format(code, formatConfig).replace(/^[\r\n]/, '')
  }

  const {
    finalStyleObject,
    collections,
  } = this

  const topBanner = genTopBanner()
  // const importReact = this.astUtils.ast2code(collections.importReactPath)
  const usingCode = fileType === 'react' ? genUsingComponentCode(usingComponent) : ''
  const styleSheet = genStyleSheet.call(this, finalStyleObject)
  const component = fileType === 'react' ? formatCode(code) : ''
  const result = [
    topBanner,
    styleSheet,
    // importReact,
    usingCode,
    component,
  ].join('\n')

  return result
}
