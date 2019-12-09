// 使用 TypeScript 编写 webpack.config.json 需要安装以下:
// yarn typescript ts-node @types/node @types/webpack @types/webpack-dev-server --dev

import path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

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

      filename: 'static/js/[name].[contenthash:8].js',

      // 所包含模块信息的注释, 在开发模式默认为 true, 生产环境默认 false
      // pathinfo: isEnvDevelopment,

      // code-splitting 中会用到该属性
      // chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',

      // publicPath: 'cdn.yancey.app/assets/', // 多用于配置 CDN
    },

    resolve: {
      // 在导入模块时, 如果模块是下列扩展名, 将不用写文件后缀
      extensions: ['.js', '.jsx', '.ts', '.tsx'],

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

      // 定制 TerserPlugin 的配置
      // minimizer: [
      //   new TerserPlugin({
      //     cache: true,
      //     parallel: true,
      //     sourceMap: true,
      //     terserOptions: {},
      //   }),
      // ],

      // 是否在编译出错的情况下生成错误资源
      // noEmitOnErrors: true,

      // webpack v4+ 提供的全新的通用分块策略
      splitChunks: {
        chunks: 'all',
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

    devServer: isEnvDevelopment
      ? {
          // 端口号
          port: 3000,

          // 开发环境的 host
          host: 'localhost',

          // 是否启用压缩
          compress: true,

          // 用于解决 SPA 刷新 404 的问题
          historyApiFallback: {
            disableDotRule: true,
          },

          // 指定静态文件的路径
          contentBase: path.join(__dirname, 'public'),

          // 配置 CORS
          allowedHosts: ['.yanceyleo.com', '.yancey.app'],

          // 启动服务后打开浏览器, 貌似不好使
          open: true,

          // 在有警告或者编译错误时, 错误信息全屏遮盖浏览器
          overlay: false,

          // 启用 webpack 的模块热替换功能
          hot: true,

          // 热更换的信息不会打印到控制台
          quiet: true,

          // 允许浏览器使用本地 IP 打开
          useLocalIp: true,

          // 只在控制台打印如下信息之一, 但在 quiet 模式无效
          // 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose' object
          // stats: 'errors-only',

          // 在构建失败时, 不需要将页面刷新作为回退
          // hotOnly: true,

          // lazy 模式, 不会监听任何文件的改动, 除非主动拉取
          // lazy: true,

          // 配合 lazy 模式使用, 可以只在某个文件被请求时编译
          // filename: 'bundle.js',

          // 代理请求, 下面例子中, 请求到的 /api/xxx 会被代理到请求 http://localhost:3000/api/xxx 上
          // proxy: {
          //   '/api': {
          //     target: 'http://localhost:3000',

          //     pathRewrite: { '^/api': '' },

          //     // 默认不接受不安全的后端请求, 关闭 secure 可解决
          //     secure: false,

          //     // 下面的例子中, /api 代理到本地服务器, 但index.html 还是接收服务器的, 可以使用 bypass
          //     bypass: function(req, res, proxyOptions) {
          //       if (req.headers.accept.indexOf('html') !== -1) {
          //         console.log('Skipping proxy for browser request.')
          //         return '/index.html'
          //       }
          //     },
          //   },
          // },

          // 你也可以代理多个路径
          // proxy: [
          //   {
          //     context: ['/auth', '/api'],
          //     target: 'http://localhost:3000',
          //   },
          // ],

          // 请求前的钩子
          // before: function(app, server) {
          //   app.get('/some/path', function(req, res) {
          //     res.json({ custom: 'response' })
          //   })
          // },

          // 请求后的钩子
          // after: function(app, server) {
          // },

          // 添加响应头
          // headers: [],

          // 开发服务器支持 https
          // https:[
          //   key: fs.readFileSync('/path/to/server.key'),
          //   cert: fs.readFileSync('/path/to/server.crt'),
          //   ca: fs.readFileSync('/path/to/ca.pem'),
          // ]
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-eval-source-map',

    // 配置构建的目标, 默认是 web, 支持下列预置字符串, 也支持一个函数.
    // 'web' | 'webworker' | 'node' | 'async-node' | 'node-webkit' | 'atom' | 'electron' | 'electron-renderer' | 'electron-main'
    target: 'web',
  }
}

export default configFactory
