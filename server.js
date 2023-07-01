const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(_dirname + '/dist/jolui'));
app.get('/*', function(req, res){
res.sendFile(path.join(_dirname + '/dist/jolui/index.html'));});
app.listen(process.env.POST || 8080);