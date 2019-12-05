# 概念

- entry

指定 webpack 构建依赖图的入口, 默认值是 `./src/index.js`, 支持指定多个入口.

```js
entry: path.resolve(__dirname, 'src/index.js'),
```

- output

指定 webpack 构建的 bundle 存放目录以及名称.

```js
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
```

- loader

- plugin

- mode
