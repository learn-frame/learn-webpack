import { Compiler } from 'webpack'

declare module 'stats-webpack-plugin' {
  interface StatsPluginOption {
    chunkModules: boolean
    exclude: RegExp[]
  }

  export default class StatsPlugin {
    constructor(file: string, options: StatsPluginOption)

    apply(compile: Compiler): void
  }
}
