const prettier = require('prettier')

module.exports = function generateReactNativeComponent() {
  function genUsingComponentCode(rnUsingComponentName) {
    const componentStr = rnUsingComponentName.join(',\n  ')
    return `import {
  AppRegistry,
  StyleSheet,
  ${componentStr}\n} from 'react-native'`
  }
  
  function genStyleSheet(finalStyleObject) {
    return `const ${this.enums.STYLESHEET_NAME} = StyleSheet.create(` + JSON.stringify(finalStyleObject, null, 2) + ')'
  }

  function genTopBanner() {
    return `//
// Created by node lib \`react-to-react-native\`.
// 
`
  }

  function formatCode(code) {
    const formatConfig = {
      jsxBracketSameLine: false,
      tabWidth: 2,
    }
    return prettier.format(code, formatConfig)
  }

  const {
    usingRNComponentNames,
    finalStyleObject,
    collections,
  } = this

  const topBanner = genTopBanner()
  const importReact = this.astUtils.ast2code(collections.importReactPath)
  const usingCode = genUsingComponentCode(usingRNComponentNames)
  const styleSheet = genStyleSheet.call(this, finalStyleObject)
  const component = formatCode(this.astUtils.ast2code(this.afterPackageCode))
  const result = [
    topBanner,
    importReact,
    usingCode,
    component,
    styleSheet,
  ].join('\n')

  return result
}
