# 浅谈 hash, chunkhash 和 contenthash

## hash

只要项目有文件更改, 整个项目的 hash 都会更改, 并且全部文件都共用相同的 hash 值, 这会导致即便只有入口 A 修改, B 的 hash 也会发生变化. 因此 hash 不适用于缓存.

## chunkhash

Chunkhash 基于 webpack 的 entry, 每个入口都有自己的哈希值. 如果该**入口点**发生了变化, 那么相应的 hash 会发生变化, 其他 entry 则不会变化.

## contenthash

只有文件内容发生变化,该文件的 hash 才会改变, 通常用于打包生成的 css 和 js 文件
