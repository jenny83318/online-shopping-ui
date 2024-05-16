// const express = require('express');
// const path = require('path');
// const app = express();
// app.use(express.static(__dirname + '/dist'));
// app.get('/*', function(req, res){
// res.sendFile(path.join(__dirname + '/dist/index.html'));});
// app.listen(process.env.POST || 8080);

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(express.static(__dirname + '/dist'));

// 添加 CORS 中間件
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://jol-boutique.onrender.com" // 替換為你的前端應用程式的域名
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

// 设置代理
app.use('/jolserver', createProxyMiddleware({
  target: 'http://jol-server.onrender.com',
  changeOrigin: true,
  secure: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  pathRewrite: {
    '^/jolserver/api': '/jolserver/api'
  }
}));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});