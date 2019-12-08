// 使用 TypeScript 编写 webpack.config.json 需要安装以下:
// yarn typescript ts-node @types/node @types/webpack @types/webpack-dev-server --dev

import path from 'path'
import glob from 'glob'
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
      filename: '[name].[chunkhash:8].js',
      path: path.resolve(__dirname, '../dist'),
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {},
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
      ],
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

    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },

    devtool: !isEnvProduction ? 'cheap-module-eval-source-map' : undefined,

    devServer: isEnvProduction
      ? {
          port: 3000,
        }
      : undefined,
  }
}

export default configFactory
