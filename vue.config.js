const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  outputDir: 'dist',

  transpileDependencies: true,

  css: {
    loaderOptions: { sass: { implementation: require('sass') } },
    extract: process.env.NODE_ENV === 'production',
  },

  productionSourceMap: false,

  configureWebpack: {
    optimization: { splitChunks: { chunks: 'all' } },
  },
})
