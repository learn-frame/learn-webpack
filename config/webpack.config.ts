// 使用 TypeScript 编写 webpack.config.json 需要安装以下:
// yarn typescript ts-node @types/node @types/webpack @types/webpack-dev-server --dev

import path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const configFactory = (env: string): Configuration => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  return {
    mode: isEnvProduction ? 'production' : 'development',

    // context: path.resolve(__dirname),

    entry: { app: './src/index.ts' },

    // 动态入口方案
    // entry: glob.sync('./src/**/index.ts').reduce((acc, path) => {
    //   const entry = path.replace('/index.ts', '')
    //   acc[entry] = path
    //   return acc
    // }, {} as { [index: string]: string }),

    output: {
      path: isEnvProduction ? path.resolve(__dirname, '../dist') : undefined,
      filename: '[name].[contenthash:8].js',
      // pathinfo: isEnvDevelopment, // 所包含模块信息的注释, 在开发模式默认为 true, 生产环境默认 false
      // chunkFilename: '[name].[contenthash:8].chunk.js', // code-splitting 中会用到该属性
      // publicPath: 'cdn.yancey.app/assets/', // 多用于配置 CDN
    },

    resolve: {
      // 在导入模块时, 如果模块是下列扩展名, 将不用写文件后缀
      extensions: ['.wasm', '.mjs', '.json', '.js', '.jsx', '.ts', '.tsx'],

      // 定义别名, 配合 tsconfig.json 一起食用
      alias: {
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@containers': path.resolve(__dirname, '../src/containers'),
      },

      // 是否允许无扩展名文件, 默认为 false.
      // 比如 Button 目录下有 index.ts, 如果是 false, 你可以通过 import xxx from 'Button' 来引用
      // 否则只能老老实实用 import xxx from 'Button/index'
      // enforceExtension: false,
    },

    module: {
      // noParse: content => /moment|lodash/.test(content),
      rules: [
        {
          test: /\.tsx?$/i,
          loader: require.resolve('ts-loader'),
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            { loader: 'sass-loader' },
          ],
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              resourceQuery: /inline/,
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },

    optimization: {
      // 为 true 时启用 TerserPlugin
      minimize: isEnvProduction,

      // 自定义 TerserPlugin 的配置
      // minimizer: [],

      // webpack v4+ 提供的全新的通用分块策略
      splitChunks: {
        chunks: 'all',
        name: false,
      },

      // 为每个仅含有 runtime 的入口起点添加一个额外 chunk
      runtimeChunk: true,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),

      new CleanWebpackPlugin(),

      // new MomentLocalesPlugin({
      //   localesToKeep: ['es-US', 'zh-CN'],
      // }),

      new webpack.ProgressPlugin(),

      new webpack.BannerPlugin({
        banner: 'Powered by Yancey Inc.',
      }),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    devtool: !isEnvProduction ? 'cheap-module-eval-source-map' : undefined,

    devServer: isEnvProduction
      ? {
          port: 3000,
        }
      : undefined,
  }
}

export default configFactory
