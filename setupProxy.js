const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://teethapi.azurewebsites.net', // 代理的目标地址
            changeOrigin: true,
            pathRewrite: {
                '^/api': 'api'  // 将请求路径中的 "/api" 替换为空
            }
        })
    );
}