const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target:'https://app.spiritx.co.nz',
    // target: 'https://www.fastmock.site/mock/9b7d0cb651c364bed9af1ae9a4abf2f7/shop',
    changeOrigin: true,
    pathRewrite: { "^/api": "" }
  }))
}