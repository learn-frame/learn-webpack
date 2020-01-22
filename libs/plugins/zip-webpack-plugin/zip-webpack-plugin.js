const JSZip = require('jszip')
const path = require('path')
const RowSource = require('')
const zip = new JSZip()

class ZipWebpackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ZipWebpackPlugin',
      async (compilation, callback) => {
        const folder = zip.folder(this.options.filename)

        for (let filename in compilation.assets) {
          const source = compilation.assets[filename].source()
          folder.file(filename, source)
        }

        const res = await zip.generateAsync({
          type: 'nodebuffer',
        })

        const outputPath = path.join(
          compilation.options.outputPath.path,
          this.options.filename + '.zip',
        )

        compilation.assets
      },
    )
  }
}

module.exports = ZipWebpackPlugin
