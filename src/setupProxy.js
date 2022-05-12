const {createProxyMiddleware} = require('http-proxy-middleware')
 
module.exports = function(app){
  app.use(createProxyMiddleware('/api',{
    // target:'http://47.93.114.103:6688/manage',
    // target:'https://www.fastmock.site/mock/9b7d0cb651c364bed9af1ae9a4abf2f7/shop',
    target:'http://lux.api.gradspace.org:5000',
    changeOrigin:true,
    pathRewrite:{"^/api":""}
  }))
}