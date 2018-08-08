// server.js

var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var app = express();
var port_number = process.env.PORT || 3000;

    app.use("/css", express.static(__dirname + '/css'));
    app.use("/images", express.static(__dirname + '/images'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use("/php", express.static(__dirname + '/php'));
    app.use("/vendor", express.static(__dirname + '/vendor'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;
    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname+'/index.html'));
    });

  app.listen(port_number, function () {
    console.log('Server is running at port: ',port_number);
  });

  app.post('/send-email', function(req, res) {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PWD
        }
      });
      let mailOptions = {
          from: process.env.EMAIL, // sender address
          to: process.env.EMAIL, // list of receivers
          subject: 'Song Request', // Subject line
          text: 'Song Name: ' + req.body.songName + ', Artist Name: ' + req.artistName, // plain text body
          html: '<p>Song Name: ' + req.body.songName + '</p><p>Artist Name: ' + req.artistName + '</p>' // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
      });
  });