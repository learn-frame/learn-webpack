const paths = require('./paths')
const path = require('path')
const Fiber = require('fibers')
const webpack = require('webpack')
const {
  setStyleLoaderOrMiniCssExtractPluginLoder,
  setCssLoader,
  setPostCssLoader,
  setSassLoader,
} = require('./stylesheet.loader')
const FileListWebpackPlugin = require('../libs/plugins/file-list-webpack-plugin/file-list-webpack-plugin')
const ZipWebpackPlugin = require('../libs/plugins/zip-webpack-plugin/zip-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(s(a|c)ss)$/
const sassModuleRegex = /\.module\.(s(a|c)ss)$/

const configFactory = (env) => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  return {
    mode: env,

    entry: {
      app: './src/index.tsx',
    },

    target: ['web', 'es5'],

    output: {
      path: isEnvProduction ? paths.distPath : undefined,

      pathinfo: isEnvDevelopment,

      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].bundle.js',

      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',

    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],

      alias: {
        '@src': paths.srcPath,
      },
    },

    module: {
      strictExportPresence: true,

      rules: [
        {
          parser: { requireEnsure: false },
        },

        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                cache: true,
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: paths.appSrc,
        },

        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[emoji].[hash:8].[ext]',
              },
            },

            {
              test: /\.tsx?$/,
              include: paths.srcPath,
              exclude: /node_modules/,
              use: [
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                  },
                },
                {
                  loader: require.resolve('thread-loader'),
                  options: {
                    workers: 3,
                  },
                },
              ],
            },

            // 自己写的 loader!!!
            {
              test: /\.txt$/,
              exclude: /node_modules/,
              loader: 'txt-loader',
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },

            {
              test: /\.(graphql|gql)$/,
              exclude: /node_modules/,
              loader: require.resolve('graphql-tag/loader'),
            },

            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: [
                setStyleLoaderOrMiniCssExtractPluginLoder(isEnvProduction),
                setCssLoader(isEnvProduction, false, 1),
                setPostCssLoader(),
              ],
              sideEffects: true,
            },

            {
              test: cssModuleRegex,
              use: [
                setStyleLoaderOrMiniCssExtractPluginLoder(isEnvProduction),
                setCssLoader(isEnvProduction, true, 1),
                setPostCssLoader(),
              ],
            },

            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: [
                setStyleLoaderOrMiniCssExtractPluginLoder(isEnvProduction),
                setCssLoader(isEnvProduction, false, 2),
                setPostCssLoader(),
                setSassLoader(),
              ],
              sideEffects: true,
            },

            {
              test: sassModuleRegex,
              use: [
                setStyleLoaderOrMiniCssExtractPluginLoder(isEnvProduction),
                setCssLoader(isEnvProduction, true, 2),
                setPostCssLoader(),
                setSassLoader(),
                {
                  loader: require.resolve('sass-resources-loader'),
                  options: {
                    resources: [
                      path.resolve(
                        __dirname,
                        '../src/assets/styles/_variables.scss',
                      ),
                      path.resolve(
                        __dirname,
                        '../src/assets/styles/_functions.scss',
                      ),
                      path.resolve(
                        __dirname,
                        '../src/assets/styles/_mixins.scss',
                      ),
                    ],
                  },
                },
              ],
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

    resolveLoader: {
      // 加载本地的 loader
      modules: ['node_modules', './libs/loaders/txt-loader'],
    },

    optimization: {
      minimize: isEnvProduction,

      minimizer: [
        () => {
          return () => {
            return {
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
              sourceMap: true,
              parallel: true, // 并行压缩
            }
          }
        },

        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],

      splitChunks: {
        chunks: 'all',
      },

      runtimeChunk: true,
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: paths.htmlTemplate,
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

      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[contenthash:8].css',
          chunkFilename: 'static/css/[contenthash:8].chunk.css',
        }),

      new FriendlyErrorsWebpackPlugin(),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.publicPath,
            to: paths.distPath,
            filter: (resourcePath) => !resourcePath.includes('index.html'),
          },
        ],
      }),

      new ForkTsCheckerWebpackPlugin(),

      // 自己写的 plugin!!!
      isEnvProduction && new FileListWebpackPlugin(),

      // 自己写的 plugin!!!
      isEnvProduction &&
        new ZipWebpackPlugin({
          filename: 'offline.zip',
        }),

      isEnvProduction && new WebpackManifestPlugin(),

      isEnvProduction && new BundleAnalyzerPlugin(),

      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

      new webpack.ProgressPlugin(),

      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
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
          contentBase: paths.publicPath,
          watchContentBase: true,
          overlay: false,
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'eval-cheap-module-source-map',

    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },

    stats: 'minimal',

    profile: true,
  }
}

module.exports = configFactory
