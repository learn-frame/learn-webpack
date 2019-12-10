# Cookbooks

这里记录一些 webpack 的技巧（我估摸着大概率是一堆 plugin，捂脸逃）。

## StatsPlugin

```ts
yarn add stats-webpack-plugin --dev
```

该插件可用于生成 stats.json 文件，生成后的文件上传到 [analyse](http://webpack.github.io/analyse/) 或者 [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)，可查看打包状态，具体配置如下。

```ts
module.exports = {
  plugins: [
    new StatsPlugin('stats.json', {
      chunkModules: true,
    }),
  ],

  profile: true,
}
```
