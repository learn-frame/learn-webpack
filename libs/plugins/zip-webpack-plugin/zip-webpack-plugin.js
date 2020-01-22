const JSZip = require('jszip')
const path = require('path')
const RawSource = require('webpack-sources').RawSource
const zip = new JSZip()

class ZipWebpackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ZipWebpackPlugin',
      (compilation, callback) => {
        const folder = zip.folder(this.options.filename)

        for (let filename in compilation.assets) {
          const source = compilation.assets[filename].source()
          folder.file(filename, source)
        }

        zip
          .generateAsync({
            type: 'nodebuffer',
          })
          .then(res => {
            const outputPath = path.join(
              compilation.options.output.path,
              this.options.filename,
            )

            const outputRelativePath = path.relative(
              compilation.options.output.path,
              outputPath,
            )

            compilation.assets[outputRelativePath] = new RawSource(res)

            callback()
          })
      },
    )
  }
}

module.exports = ZipWebpackPlugin
