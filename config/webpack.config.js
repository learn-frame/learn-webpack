const path = require('path')
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
    path: path.resolve(__dirname, 'dist'),

    // path: path.resolve(__dirname, '../dist/[hash]'),
    // publicPath: 'http://cdn.example.com/assets/[hash]/'
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
    // splitChunks 用于分离三方库, 它充分利用浏览器缓存
    // 4.0 版本之前采用多入口 + CommonsChunkPlugin 的方式进行三方库的分离
    splitChunks: {
      chunks: 'all',
    },
  },
}
