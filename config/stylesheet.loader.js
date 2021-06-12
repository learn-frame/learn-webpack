const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Fiber = require('fibers')

function setStyleLoaderOrMiniCssExtractPluginLoder(isEnvProduction) {
  return isEnvProduction
    ? {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../../' },
      }
    : require.resolve('style-loader')
}

function setCssLoader(isEnvProduction, isCssModule, importLoaders) {
  return {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders,
      modules: isCssModule
        ? {
            localIdentName: isEnvProduction
              ? '[hash:base64:6]'
              : '[path][name]__[local]',
          }
        : false,
    },
  }
}

function setPostCssLoader() {
  return {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env'],
      },
    },
  }
}

function setSassLoader() {
  return {
    loader: require.resolve('sass-loader'),
    options: {
      implementation: require('sass'),
      sassOptions: {
        fiber: Fiber,
      },
    },
  }
}

module.exports = {
  setStyleLoaderOrMiniCssExtractPluginLoder,
  setCssLoader,
  setPostCssLoader,
  setSassLoader,
}
