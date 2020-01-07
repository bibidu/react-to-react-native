const transform = require('css-to-react-native').default

module.exports = function cssToReactNative(obj) {
  try {
    const arrayStyle = objStyleToTransformArray(obj)
    const result = transform(arrayStyle)
    return result
  } catch (error) {
    return '[ERROR] cssToReactNative error'
  }
}

const objStyleToTransformArray = (obj) => {
  const array = []
  for (let key of Object.keys(obj)) {
    const value = obj[key]
    array.push([key, value])
  }
  return array
}
