# Cookbooks

这里记录一些 webpack 的技巧和注意事项.

- [StatsPlugin](#statsplugin)
- [loader 书写顺序](#loader-%E4%B9%A6%E5%86%99%E9%A1%BA%E5%BA%8F)

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

## 构建优化篇

### stats

webpack 内置的 stats 属性可以做一些 build 统计

### speed-measure-webpack-plugin

`speed-measure-webpack-plugin` 可以用在 build 阶段, 它用于分析各个 loader 和 plugin 的占用时间.

![speed-measure-webpack-plugin](./images/speed-measure-webpack-plugin.jpg)

### webpack-bundle-analyzer

神器, 懂的人自然懂, 不多说

### thread-loader

多线程加载, 本质使用 worker.

### terser-webpack-plugin

webpack 4 内置了 terser-webpack-plugin, 开启 parallel 参数即可享受并行压缩带来的快感.

### 善用 exclude

`exclude: /node_modules/` 也是一种构建优化的好方式.

### purgecss-webpack-plugin

可以清除没有用到的 css 样式.

### image-webpack-loader

可以用于图片的压缩, 当然我选择云厂商的服务
