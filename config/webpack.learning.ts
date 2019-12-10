import path from 'path'
import glob from 'glob'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const configFactory = (
  env: 'development' | 'production' | 'none',
): Configuration => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  return {
    mode: isEnvProduction ? 'production' : 'development',

    // 指定当前工程的基础路径, 默认使用当前路径, 可提供一个名称
    // 便于使配置独立于 CWD (current working dictionary) 当前执行路径
    context: path.resolve(__dirname),

    // 项目的入口, 默认是 src/index, 可支持多个入口
    entry: {
      app: './src/index.ts',

      // 动态入口方案
      ...glob.sync('./src/**/index.ts').reduce((acc, path) => {
        const entry = path.replace('/index.ts', '')
        acc[entry] = path
        return acc
      }, {} as { [index: string]: string }),
    },

    output: {
      // 配置打包输入路径
      path: isEnvProduction ? path.resolve(__dirname, '../dist') : undefined,

      // 配置打包文件名
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',

      // 定义 chunk 文件的名称, 常用于 code-splitting
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',

      // 所包含模块信息的注释, 在开发模式默认为 true, 生产环境默认 false
      pathinfo: isEnvDevelopment,

      // 定义 chunk 请求超时时间, 默认 12000 毫秒
      chunkLoadTimeout: 12000,

      // 多用于配置 CDN
      publicPath: 'cdn.yancey.app/assets/',

      // 下面三个一般一起食用, 用于打包库或框架, 我还是用 rollup (手动白眼)
      library: 'someLibName',
      libraryTarget: 'umd',
      auxiliaryComment: 'Test Comment',

      // 只能用于 target 是 web 的情况下, 用于 JSONP 的按需加载
      // 默认是 false, 即禁用跨域加载; 还支持 'anonymous' (不带凭据启用跨域加载) 和 'use-credentials' (带凭据启用跨域加载)
      crossOriginLoading: false,

      // 配置注入的 script 标签的类型, 默认是 'text/javascript', 还支持 'module'
      jsonpScriptType: 'text/javascript',
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
      enforceExtension: false,
    },

    module: {
      noParse: content => /moment|lodash/.test(content),

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
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {},
        }),
      ],

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

      // 拷贝静态文件到 dist 目录下
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../public/assets'),
          to: path.resolve(__dirname, '../dist/public/assets'),
        },
      ]),

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
          stats: 'errors-only',

          // 在构建失败时, 不需要将页面刷新作为回退
          hotOnly: true,

          // lazy 模式, 不会监听任何文件的改动, 除非主动拉取
          lazy: true,

          // 配合 lazy 模式使用, 可以只在某个文件被请求时编译
          filename: 'bundle.js',

          // 代理请求, 下面例子中, 请求到的 /api/xxx 会被代理到请求 http://localhost:3000/api/xxx 上
          proxy: {
            '/api': {
              target: 'http://localhost:3000',

              pathRewrite: { '^/api': '' },

              // 默认不接受不安全的后端请求, 关闭 secure 可解决
              secure: false,

              // 下面的例子中, /api 代理到本地服务器, 但index.html 还是接收服务器的, 可以使用 bypass
              bypass: function(req: any, res: any, proxyOptions: any) {
                if (req.headers.accept.indexOf('html') !== -1) {
                  console.log('Skipping proxy for browser request.')
                  return '/index.html'
                }
              },
            },
          },

          // 你也可以代理多个路径
          // proxy: [
          //   {
          //     context: ['/auth', '/api'],
          //     target: 'http://localhost:3000',
          //   },
          // ],

          // 请求前的钩子
          before: function(app, server) {
            app.get('/some/path', function(req, res) {
              res.json({ custom: 'response' })
            })
          },

          // 请求后的钩子
          after: function(app, server) {},

          // 添加响应头
          headers: {},

          // 开发服务器支持 https
          https: true,
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-eval-source-map',

    // 配置构建的目标, 默认是 web, 支持下列预置字符串, 也支持一个函数.
    // 'web' | 'webworker' | 'node' | 'async-node' | 'node-webkit' | 'atom' | 'electron' | 'electron-renderer' | 'electron-main'
    target: 'web',

    // 监听模式, 默认会在 webpack-dev-server 中开启
    watch: isEnvDevelopment,

    watchOptions: {
      // 当第一处改动发生时, webpack 会等 300ms,
      // 如果 300ms 内有其他改动, 将合并到一起进行热更新
      aggregateTimeout: 300,

      // 忽略某些文件的变动热更新
      ignored: ['node_modules'],

      // 当自动热更新不好用时, 启用轮询查询变动
      poll: 1000,
    },

    // 不将三方依赖打包, 而是直接使用它的 CDN 形式
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_',
      },
    },

    // 配置在非 node 环境也可以使用 node 的 polyfill
    // 这些配置是 NodeStuffPlugin 提供
    // 当 target 为 'web' 或者 'webworker', 会自动开启 NodeStuffPlugin
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },

    performance: {
      // 在性能出现问题时, 设置异常抛出的等级, 默认为 'warning', 还可以是 false 和 'error'
      hints: false,

      // 设置入口文件的最大 size, 默认为 250kb
      maxEntrypointSize: 250000,

      // 设置资源文件的最大 size, 默认为 250kb
      maxAssetSize: 250000,

      // assetFilter 用于告诉 webpack 关注哪些格式的文件
      // 下面的例子是只关注 js 文件的性能问题
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      },
    },

    // stats 用于配置需要显示的部分编译信息
    stats: {
      /*  */
    },

    // 在出现错误时迫使 webpack 退出其打包过程
    bail: true,

    // 使用缓存以提高构建速度
    cache: true,

    // 限时并发数量以微调性能
    parallelism: 1000,

    // 可以使用此文件来跟踪在每次构建之间的模块变化
    // 在 code splittnig 会很有用，可辅助进行配置缓存策略
    recordsPath: path.join(__dirname, 'records.json'),

    // 指定读取最后一条记录的文件的名称
    recordsInputPath: path.join(__dirname, 'records.json'),

    // 指定记录要写入的位置
    recordsOutputPath: path.join(__dirname, 'newRecords.json'),

    // 给该配置起个名，适用于一套代码多个配置的场景
    name: 'awesome webpack config',
  }
}

export default configFactory
