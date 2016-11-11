var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');

var adminEmailList = 'motelmartian@gmail.com, rcarle3911@gmail.com, jordanf08@gmail.com, jwmooreiv@gmail.com, dsteele0301@gmail.com, smith.glenisha@me.com, audioinstalr@yahoo.com, blacksmith_22@yahoo.com, fish5802@gmail.com';

var mailOptions = {
	from: '"Martian Motel" <motelmartian@gmail.com>',
	to: '';
	cc: 'motelmartian@gmail.com',
	subject: 'Martian Motel',
	text: 'Server Online',
	html: '<b>Server Online</b>'
};

transporter.sendMail(mailOptions, function(error, info) {
	if(error) {
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
});

app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");