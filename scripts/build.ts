import webpack from 'webpack'
import configFactory from '../config/webpack.learning'

const config = configFactory('production')

async function build() {
  console.log('Creating an optimized production build...')

  const compiler = webpack(config)

  // 在脚本中, 也可以用如下方式引入插件
  // new webpack.ProgressPlugin().apply(compiler)

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
