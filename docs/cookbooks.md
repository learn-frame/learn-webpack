# Cookbooks

这里记录一些 webpack 的技巧和注意事项.

## StatsPlugin

```ts
yarn add stats-webpack-plugin --dev
```

该插件可用于生成 stats.json 文件 (统计数据信息), 生成后的文件上传到 [analyse](http://webpack.github.io/analyse/) 或者 [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/), 可查看打包状态, 具体配置如下.

```ts
module.exports = {
  plugins: [
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]moment/],
    }),
  ],

  profile: true,
}
```

## loader 书写顺序

loader 的执行顺序是从右向左, 以 css 为例, 先要引用 style-loader, 再引用 css-loader, 这样先会通过 css-loader 解析 css, 再通过 style-loader 注入到 js 中.

```ts
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
}
```

## tree shaking

只有编译的模块是 ES6+, 如果是一个方法, 且该方法没有副作用, 才有可能会被 tree shaking.

## 打包库

对于库的打包可以参考如下配置, 并且记得要配置 package.json 里的 main 字段.

```ts
module.exports = {
  mode: 'none',
  entry: {
    'large-number.prod': './src/index.js',
    'large-number.prod.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    library: 'largeNumber',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TererPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
}
```

我选择 rollup.
