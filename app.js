var express = require('express');
var app = express();

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.get('/hello', function (req, res) {
  res.send('world');
});

app.listen(process.env.PORT);
