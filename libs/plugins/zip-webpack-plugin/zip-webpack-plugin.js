class ZipWebpackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    console.log('my-plugin is executed!')
  }
}

module.exports = ZipWebpackPlugin
