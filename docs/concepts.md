# 概念

## entry: string | string[] | { [entryChunkName: string]: string | string[] }

指定 webpack 构建依赖图的入口, 默认值是 `./src/index.js`. 它支持一个字符串, 一个数组或一个对象, 当然最常见的还是使用一个对象.

```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js',
  },
}
```

- output

指定 webpack 构建的 bundle 存放目录以及名称. 它接收 path 和 filename 两个属性, 现代玩法都是给 filename 增加哈希, 以避免浏览器缓存导致加载旧代码; 同时它与 splitChunks 结合, 用于分离三方库, 充分利用浏览器缓存. emmmmmmm

可用的哈希有三种, 分别是 `hash`, `thunkhash` 和 `contenthash`, 关于这三种方式的异同可参考 [浅谈 hash, thunkhash 和 contenthash](./hash.md)

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
  },
}
```

## loader

webpack 本身只能解析 `.js` 和 `.json` 文件, loader 是将其他类型转成**模块**, 以添加到依赖图中. 它接收两个属性, 分别是 `test` 和 `use`, 前者是一个**正则表达式**, 匹配需要被 loader 转换的文件格式, 后者是**使用的 loader 名**. 下面的例子是对 `.txt` 格式的文件使用 `raw-loader`. 下面的例子中, 当 webpack 编译器遇到 `import xxx from 'xxx.txt'` 时, 就会先用 `raw-loader` 转一下.

```js
module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
}
```

对于 loader, 还有两种使用用方式, 分别是 **内联** 和 **CLI**, 不过都不常用.

```js
// 内联 loader
import Styles from 'style-loader!css-loader?modules!./styles.css';

// CLI loader
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

## plugin

可以做到 loader 无法做到的事, 如打包优化, 资源管理, 注入环境变量等.

```js
module.exports = {
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}
```

## mode

设置 webpack 的编译模式, 有 `production`, `development` 和 `none` 三种选择, 默认是 `production`. 它可以在不同的编译环境下启用 webpack 内置的优化策略. 具体优化策略详情可参照[官方文档](https://webpack.docschina.org/concepts/mode).

```js
module.exports = {
  mode: 'production' | 'development' | 'none',
}
```

## browser compatibility

webpack 的 import() 和 require.ensure() 需要 Promise, 若要兼容低端浏览器, 需要考虑一些官方提供的 polyfill. (喂! 说你呢, Internet Explorer!)

## 流程

1. 读取配置文件, 按命令 初始化 配置参数, 创建 Compiler 对象;
2. 调用插件的 apply 方法 挂载插件 监听, 然后从入口文件开始执行编译;
3. 按文件类型, 调用相应的 Loader 对模块进行 编译, 并在合适的时机点触发对应的事件, 调用 Plugin 执行, 最后再根据模块 依赖查找 到所依赖的模块, 递归执行第三步;
4. 将编译后的所有代码包装成一个个代码块 (Chuck), 并按依赖和配置确定 输出内容。这个步骤, 仍然可以通过 Plugin 进行文件的修改;
5. 最后, 根据 Output 把文件内容一一写入到指定的文件夹中, 完成整个过程;
