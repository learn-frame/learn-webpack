const loaderUtils = require('loader-utils')
const path = require('path')
const process = require('process')
const validateOptions = require('schema-utils')

const schema = require('./options.json')

module.exports = function(source) {
  validateOptions(schema, options, {
    name: 'Txt Loader',
  })

  if (!this.emitFile)
    throw new Error('Txt Loader\n\nemitFile is required from module system')

  // 通过 loaderUtils.getOptions 方法获取 options 中的参数
  const { name } = loaderUtils.getOptions(this) || {}

  const result = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  const url = loaderUtils.interpolateName(this, name, {
    result,
  })

  this.emitFile(url, result)

  // 同步 loader 可直接返回结果
  return `export default ${result}`

  /*   // 在同步模式, 除了直接使用 return result, 还可以使用 this.callback 的方式
  // this.callback 的第一个参数是 Error, 之后是一个参数序列
  // 这也解释了 loader-runner 中的 result 为什么是一个数组
  this.callback(null, result, esModule)

  // 对于一个异步 loader, 则必须使用如下方式
  const callback = this.async()
  fs.readFile('file path...', (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, data)
    }
  })

  // webpack 默认给 loader 开启了缓存
  // 前提是保证 loader 在相同的输入有相同的输出(即保证是纯函数, 无副作用)

  // 你可以显式调用下面的语句强制不使用缓存
  this.cacheable(false) */
}
