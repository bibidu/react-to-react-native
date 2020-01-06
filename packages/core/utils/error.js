module.exports = function error(msg) {
  console.log()
  console.log(`[ERROR]: ${msg}`)
  console.log()
  throw Error(msg)
}