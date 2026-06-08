const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,

  // 新增：给老组件里的 @api/app.js 提供路径别名
  configureWebpack: {
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'src/api')
      }
    }
  },

  devServer: {
    port: 8080,
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    }
  }
})