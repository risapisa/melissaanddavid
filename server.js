// server.js

var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');

    var app = express();
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/images", express.static(__dirname + '/images'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use("/vendor", express.static(__dirname + '/vendor'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    var port = 3000;
    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname+'/index.html'));
    });

    var transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true
    });

    app.post('/send-yes-email', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      var name = req.body.from;
      console.log(name);
      var peopleAttending = req.body.attending;
      var message = req.body.message;
      var html = '<h1>Congratulations! ' + name + ' has said that they will be coming to your wedding!</h1><p>They will be arriving with ' +
          peopleAttending-1 + ' other persons.</p><p>Here is a personal message they have left you:</p><i>' + message + '</i>';

      var mailOptions = {
          from: 'risapisa@gmail.com', // sender address
          to: 'risapisa@gmail.com', // list of receivers
          subject: '' + name + ' is coming to your wedding!' , // Subject line
          text: 'Congratulations! ' + name + ' has said that they will be coming to your wedding! They will be arriving with ' +
          peopleAttending-1 + ' other persons. Here is a personal message they have left you: ' + message, // plain text body
          html: html // html body
      };

      console.log(mailOptions);

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
    });

    app.post('/send-no-email', function (req, res) {
      var name = req.body.from;
      var message = req.body.message;
      var html = '<h1>Unfortunately, ' + name + ' has said that they will not be coming to your wedding.</h1><p>Here is a personal message they have left you:</p><i>' + message + '</i>';

      var mailOptions = {
          from: ''+ name, // sender address
          to: 'risapisa@gmail.com', // list of receivers
          subject: '' + name + ' is not coming to your wedding.', // Subject line
          text: 'Unfortunately, ' + name + ' has said that they will not be coming to your wedding. Here is a personal message they have left you: ' + message, // plain text body
          html: html // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
    });
  app.listen(port, function(){
    console.log('Server is running at port: ',port);
  });