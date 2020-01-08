module.exports = function generateReactNativeComponent({
  ctx
}) {
  const rnUsingComponentName = ctx.usingRNComponentNames
  const usingCode = genUsingComponentCode(rnUsingComponentName)
  const component = ctx.astUtils.ast2code(ctx.afterPackageCode)

  const result = [
    usingCode,
    component,
  ].join('\n')

  return result
}

function genUsingComponentCode(rnUsingComponentName) {
  const componentStr = rnUsingComponentName.join(',\n  ')
  return `import {
  AppRegistry,
  StyleSheet,
  ${componentStr}\n} from 'react-native'`
}