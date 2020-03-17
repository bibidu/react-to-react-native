const prettier = require('prettier')

// TODO: update 传参改为从ctx中获取
module.exports = function generateReactNativeComponent({
  importReactCode,
  fileType,
  usingComponent,
  code,
  getResourceRelativePath,
}) {
  const ctx = this

  function genUsingComponentCode(usingComponent) {
    const componentStr = (usingComponent || []).join(',\n  ')
    return `import {
  AppRegistry,
  StyleSheet,
  ${componentStr}\n} from 'react-native'`
  }
  
  function genRuntimeUtils() {
    return `import * as ${ctx.enums.RNUTILS_USE_NAME} from '${getResourceRelativePath(ctx.enums.RNUTILS_FILE_NAME + '.js')}'`
  }

  function genStyleSheet(finalStyleObject) {
    return `import ${this.enums.STYLESHEET_NAME} from '${getResourceRelativePath(this.enums.STYLESHEET_FILE_NAME + '.js')}'`
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

  function genReactImport() {
    return importReactCode
  }

  const {
    finalStyleObject,
    collections,
  } = this

  const topBanner = genTopBanner()
  const reactImport = genReactImport()
  const usingCode = fileType === 'react' ? genUsingComponentCode(usingComponent) : ''
  const runtimeUtils = genRuntimeUtils()
  const styleSheet = genStyleSheet.call(this, finalStyleObject)
  const component = fileType === 'react' ? formatCode(code) : ''
  const result = [
    topBanner,
    reactImport,
    usingCode,
    runtimeUtils,
    styleSheet,
    '',
    component,
  ].join('\n')

  return result
}
