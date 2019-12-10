import path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

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
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),

      new CleanWebpackPlugin(),

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
  }
}

export default configFactory
