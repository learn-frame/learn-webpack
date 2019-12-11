import path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import StatsPlugin from 'stats-webpack-plugin'

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const configFactory = (
  env: 'development' | 'production' | 'none',
): Configuration => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  return {
    mode: isEnvProduction ? 'production' : 'development',

    entry: {
      app: './src/index.ts',
    },

    output: {
      path: isEnvProduction ? path.resolve(__dirname, '../dist') : undefined,

      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',

      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],

      alias: {
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@containers': path.resolve(__dirname, '../src/containers'),
      },
    },

    module: {
      rules: [
        // ts/tsx 的 loader
        {
          test: /\.tsx?$/i,
          loader: require.resolve('ts-loader'),
          exclude: /node_modules/,
        },

        // css 的 loader
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
            },
          ],
          sideEffects: true
        },

        // css module 的 loader
        {
          test: cssModuleRegex,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  localIdentName: isEnvProduction
                    ? '[hash:base64:6]'
                    : '[path][name]__[local]',
                },
              },
            },
          ],
        },

        // sass 的 loader
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('sass-loader'),
            },
          ],
        },
      ],
    },

    optimization: {
      minimize: isEnvProduction,

      splitChunks: {
        chunks: 'all',
      },

      runtimeChunk: true,
    },

    plugins: [
      // 用于生成构建目标 HTML 文件
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),

      // 用于清除旧的构建文件
      new CleanWebpackPlugin(),

      // 用于复制文件夹, 多用于拷贝静态资源
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../public/assets'),
          to: path.resolve(__dirname, '../dist/public/assets'),
        },
      ]),

      // MiniCssExtractPlugin 的功能与 style-loader 正相反
      // style-loader 是将样式注入到 js 文件中
      // 而 MiniCssExtractPlugin 是将 css 文件分离出来
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

      // 辅助生成统计信息文件 stats.json, 最好同步开启 profile: true
      // 生成的 stats 文件可上传至 http://webpack.github.io/analyse/
      new StatsPlugin('stats.json', {
        chunkModules: true,
        exclude: [/node_modules[\\\/]moment/, /node_modules[\\\/]lodash/],
      }),

      // 在终端显示构建进度条
      new webpack.ProgressPlugin(),

      // 给打包的文件头部注入版权信息
      new webpack.BannerPlugin({
        banner: 'Powered by Yancey Inc.',
      }),

      // 忽略库中的一些包
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    devServer: isEnvDevelopment
      ? {
          port: 3000,
          host: 'localhost',
          compress: true,
          historyApiFallback: {
            disableDotRule: true,
          },
          contentBase: path.join(__dirname, 'public'),
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-eval-source-map',

    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
    },

    profile: true,
  }
}

export default configFactory
