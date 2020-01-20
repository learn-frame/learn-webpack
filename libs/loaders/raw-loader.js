

module.exports = function(source) {
  const result = JSON.parse(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  return `export default ${result}`
}
