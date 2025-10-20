const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false,
  lintOnSave: false,
  // 配置publicPath，确保在生产环境中正确加载资源
  publicPath: '/',
  // 配置输出目录
  outputDir: 'dist',
  // 配置构建时的文件名哈希
  filenameHashing: true,
  // 开发服务器配置
  devServer: {
    historyApiFallback: true
  }
})
