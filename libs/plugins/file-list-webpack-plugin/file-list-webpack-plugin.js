class FileListWebpackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'FileListWebpackPlugin',
      (compilation, compilationParams) => {
        let filelist = '# File List\n\n'

        for (const filename in compilation.assets) {
          filelist += '- ' + filename + '\n'
        }

        compilation.assets['filelist.md'] = {
          source: function() {
            return filelist
          },
          size: function() {
            return filelist.length
          },
        }
      },
    )
  }
}

module.exports = FileListWebpackPlugin
