const { runLoaders } = require('loader-runner')
const fs = require('fs')
const path = require('path')
const process = require('process')

runLoaders(
  {
    resource: path.resolve(process.cwd(), 'src/assets/texts/index.txt'),
    loaders: [path.resolve(__dirname, '../loaders/raw-loader.js')],
    context: {
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  function(err, result) {
    err ? console.log(err) : console.log(result)
    process.exit(0)
  },
)
