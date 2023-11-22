const proxy = require('http-proxy-middleware');
// eslint-disable-next-line no-undef
module.exports = function (app) {
  app.use(
    '/didapi',
    proxy.createProxyMiddleware({
      target: 'https://api.d-id.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/didapi/': '/',
      },
      logLevel: 'debug',
    })
  );
};
