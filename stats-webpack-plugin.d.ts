declare module 'stats-webpack-plugin' {
  interface StatsPluginOption {
    chunkModules: boolean
    exclude: RegExp[]
  }

  class StatsPlugin {
    constructor(file: string, options: StatsPluginOption)

    apply(): void
  }

  export default StatsPlugin
}