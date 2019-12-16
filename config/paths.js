const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  publicPath: resolveApp('public'),
  distPath: resolveApp('dist'),
  htmlTemplate: resolveApp('public/index.html'),
  srcPath: resolveApp('src'),
}
