const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = environment => {
  const isEnvDevelopment = environment === 'development'
  const isEnvProduction = environment === 'production'

  return {
    mode: environment,
    entry: { app: './src/index.ts' },
    output: {
      filename: '[name].[chunkhash:8].js',
      path: path.resolve(__dirname, '../dist'),

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
        {
          test: /\.css$/i,
          use: [
            { loader: 'style-loader' }, // style-loader 将 css 注入到 js 中
            {
              loader: 'css-loader', // css-loader 会像解析 import/require() 语句一样来解析 @import 和 url()
              options: {
                modules: true,
              },
            },
            { loader: 'sass-loader' },
          ],
        },
      ],
    },
    plugins: [
      // 生成 HTML 模版文件
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),

      new CleanWebpackPlugin(), // 新编译前清除掉旧 dist 里的文件

      // new BundleAnalyzerPlugin(), // 生成打包后 bundle 分析

      new webpack.ProgressPlugin(), // 打包过程中显示进度

      // 在每个打包后的文件前缀上 banner 信息
      new webpack.BannerPlugin({
        banner: 'Powered by Yancey Inc.',
      }),

      // 下面的代码可以将 moment 中的 locale 不打包
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 一个专门配置 moment 中 locale 的插件
      // new MomentLocalesPlugin({
      //   localesToKeep: ['es-US', 'zh-CN'],
      // }),
    ],
    optimization: {
      // splitChunks 用于分离三方库, 它充分利用浏览器缓存
      // 4.0 版本之前采用多入口 + CommonsChunkPlugin 的方式进行三方库的分离
      splitChunks: {
        chunks: 'all',
      },
    },
  }
}
