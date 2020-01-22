# 构建优化篇

## stats

webpack 内置的 stats 属性可以做一些构建统计

## speed-measure-webpack-plugin

可以用在 build 阶段, 它用于分析各个 loader 和 plugin 的占用时间.

![speed-measure-webpack-plugin](./images/speed-measure-webpack-plugin.jpg)

## webpack-bundle-analyzer

神器, 懂的人自然懂, 分析打包体积

## thread-loader

多线程加速 loader.

## terser-webpack-plugin

webpack 4 内置了 terser-webpack-plugin, 开启 parallel 参数即可享受并行压缩带来的快感.

## 善用 include / exclude

`exclude: /node_modules/` 也是一种构建优化的好方式.

## alias

alias 精确指向 node_module 的包

## extensions

精确定位 extensions: ['.js', '.jsx', '.ts', '.tsx'],

## purgecss-webpack-plugin

可以清除没有用到的 css 样式.

## image-webpack-loader

可以用于图片的压缩, 当然我选择云厂商的服务

## DllPlugin 抽离三方模块

![dll 分包](./images/dll-plugin.jpg)

## 配置缓存

诸如 TerserPlugin, eslint-loader 阶段都可以配置缓存

## externals

用于将静态库指向 cdn, 从而使打包过程略过相应的包

## tree-shaking

只有编译的模块是 ES6+, 且没有副作用, 才有可能会被 tree shaking.
