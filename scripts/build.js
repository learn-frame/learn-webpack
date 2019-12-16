const webpack = require('webpack')
const fs = require('fs-extra')
const configFactory = require('../config/webpack.config')
const paths = require('../config/paths')

const config = configFactory('production')

async function build() {
  console.log('Creating an optimized production build...')

  fs.emptyDirSync(paths.distPath)

  copyPublicFolder()

  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log('build error')
        return reject(err)
      } else {
        console.log('build success')
        return resolve({
          stats,
        })
      }
    })
  })
}

function copyPublicFolder() {
  fs.copySync(paths.publicPath, paths.distPath, {
    dereference: true,
    filter: file => file !== paths.htmlTemplate,
  })
}

build()
