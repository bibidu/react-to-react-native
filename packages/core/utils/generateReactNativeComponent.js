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

  const {
    usingRNComponentNames,
    finalStyleObject,
    collections,
  } = this

  const topBanner = genTopBanner()
  const importReact = this.astUtils.ast2code(collections.importReactPath)
  const usingCode = genUsingComponentCode(usingRNComponentNames)
  const styleSheet = genStyleSheet.call(this, finalStyleObject)
  const component = this.astUtils.ast2code(this.afterPackageCode)
  const result = [
    topBanner,
    importReact,
    usingCode,
    component,
    styleSheet,
  ].join('\n')

  return result
}
