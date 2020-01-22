const { runLoaders } = require('loader-runner')
const fs = require('fs')
const path = require('path')
const process = require('process')

runLoaders(
  {
    resource: path.resolve(process.cwd(), 'src/assets/texts/demo.txt'),
    loaders: [
      {
        loader: path.resolve(process.cwd(), 'libs/loaders/txt-loader.js'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
    context: {
      context: {
        emitFile: () => {},
      },
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  function(err, result) {
    err ? console.log(err) : console.log(result)
  },
)
