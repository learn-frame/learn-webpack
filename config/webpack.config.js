const path = require('path')
const Fiber = require('fibers')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const configFactory = env => {
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
      strictExportPresence: true,

      rules: [
        { parser: { requireEnsure: false } },

        {
          oneOf: [
            // 静态图片 loader,
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[emoji].[hash:8].[ext]',
              },
            },

            // ts/tsx
            {
              test: /\.tsx?$/,
              include: path.resolve(__dirname, '../src'),
              use: ['ts-loader'],
              exclude: /node_modules/,
            },

            // css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../../' },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: { importLoaders: 1 },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-preset-env')(),
                      require('stylelint')(),
                    ],
                    sourceMap: isEnvProduction,
                  },
                },
              ],
              sideEffects: true,
            },

            // css module
            {
              test: cssModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../../' },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: {
                      localIdentName: isEnvProduction
                        ? '[hash:base64:6]'
                        : '[path][name]__[local]',
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-preset-env')(),
                      require('stylelint')(),
                    ],
                    sourceMap: isEnvProduction,
                  },
                },
              ],
            },

            // sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../../' },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: { importLoaders: 2 },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    implementation: require('sass'),
                    sassOptions: {
                      fiber: Fiber,
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-preset-env')(),
                      require('stylelint')(),
                    ],
                    sourceMap: isEnvProduction,
                  },
                },
              ],
              sideEffects: true,
            },

            // sass module
            {
              test: sassModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../../' },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                    modules: {
                      localIdentName: isEnvProduction
                        ? '[hash:base64:6]'
                        : '[path][name]__[local]',
                    },
                  },
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    implementation: require('sass'),
                    sassOptions: {
                      fiber: Fiber,
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-preset-env')(),
                      require('stylelint')(),
                    ],
                    sourceMap: isEnvProduction,
                  },
                },
              ],
            },

            // 图片走 url-loader, 其他格式静态文件走 file-loader
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
      minimize: isEnvProduction,

      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: true,
        }),

        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
      ],

      splitChunks: {
        chunks: 'all',
      },

      runtimeChunk: true,
    },

    plugins: [
      // 用于生成构建目标 HTML 文件
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),

      // MiniCssExtractPlugin 的功能与 style-loader 正相反
      // style-loader 是将样式注入到 js 文件中
      // 而 MiniCssExtractPlugin 是将 css 文件分离出来
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

      isEnvProduction && new ManifestPlugin(),

      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

      // 在终端显示构建进度条
      new webpack.ProgressPlugin(),

      // 忽略库中的一些包
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ].filter(Boolean),

    devServer: isEnvDevelopment
      ? {
          port: 3000,
          host: 'localhost',
          hot: true,
          compress: true,
          publicPath: '/',
          quiet: true,
          clientLogLevel: 'none',
          historyApiFallback: {
            disableDotRule: true,
          },
          contentBase: path.join(__dirname, 'dist'),
          watchContentBase: true,
          overlay: false,
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-eval-source-map',

    externals: {
      react: 'React',
    },

    profile: true,
  }
}

module.exports = configFactory
