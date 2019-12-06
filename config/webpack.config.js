const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: { app: './src/index.ts' },
  output: {
    filename: '[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new webpack.BannerPlugin({
      banner: 'Powered by Yancey Inc.',
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['es-US', 'zh-CN'],
    }),
  ],
  optimization: {
    // 充分利用浏览器缓存, 分离三方库
    splitChunks: {
      chunks: 'all',
    },
  },
}
