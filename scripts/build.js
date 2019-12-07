const webpack = require('webpack')
const configFactory = require('../config/webpack.config')

const config = configFactory('production')

async function build() {
  console.log('Creating an optimized production build...')

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

build()
