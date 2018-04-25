// server.js

var express = require('express');
var path = require('path');
var app = express();

    app.use("/css", express.static(__dirname + '/css'));
    app.use("/images", express.static(__dirname + '/images'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use("/vendor", express.static(__dirname + '/vendor'));
    var port = 3000;
    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname+'/index.html'));
    });

  app.listen(port, function () {
    console.log('Server is running at port: ',port);
  });
