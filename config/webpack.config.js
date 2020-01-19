const paths = require('./paths')
const path = require('path')
const Fiber = require('fibers')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const configFactory = env => {
  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  return {
    mode: env,

    entry: {
      app: './src/app.tsx',
    },

    output: {
      path: isEnvProduction ? paths.distPath : undefined,

      pathinfo: isEnvDevelopment,

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
        '@src': paths.srcPath,
      },
    },

    module: {
      strictExportPresence: true,

      rules: [
        {
          parser: { requireEnsure: false },
        },

        // {
        //   test: /\.(js|mjs|jsx|ts|tsx)$/,
        //   enforce: 'pre',
        //   use: [
        //     {
        //       options: {
        //         cache: true,
        //         eslintPath: require.resolve('eslint'),
        //         resolvePluginsRelativeTo: __dirname,
        //       },
        //       loader: require.resolve('eslint-loader'),
        //     },
        //   ],
        //   include: paths.appSrc,
        // },

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
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
              exclude: /node_modules/,
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
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: { publicPath: '../../' },
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    sourceMap: isEnvProduction,
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
                    sourceMap: isEnvProduction,
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
                  options: {
                    importLoaders: 2,
                    sourceMap: isEnvProduction,
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
              sideEffects: true,
            },

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
                    sourceMap: isEnvProduction,
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

      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

      new FriendlyErrorsWebpackPlugin(),

      new CopyWebpackPlugin([
        {
          from: paths.publicPath,
          to: paths.distPath,
        },
      ]),

      new ForkTsCheckerWebpackPlugin(),

      isEnvProduction && new ManifestPlugin(),

      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

      new webpack.ProgressPlugin(),

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
          contentBase: paths.publicPath,
          watchContentBase: true,
          overlay: false,
        }
      : undefined,

    devtool: isEnvProduction ? 'source-map' : 'cheap-module-eval-source-map',

    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },

    profile: true,
  }
}

module.exports = configFactory
