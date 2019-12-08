import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import configFactory from '../config/webpack.config'

const config = configFactory('development')

async function start() {
  console.log('Dev server is starting...')

  const compiler = webpack(config)

  const devServer = new WebpackDevServer(compiler)

  devServer.listen(3000, 'localhost', err => {
    if (err) {
      return console.log(err)
    }
  })
}

start()
