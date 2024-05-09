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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
  })
);
// 设置代理
app.use('/jolserver', createProxyMiddleware({
  target: 'http://jol-server.onrender.com',
  changeOrigin: true,
  secure: false,
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






