require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('config.json');


//Test Code
var userService = require('services/users.service');
userService.create({
    firstName: "John",
    lastName: "Smith",
    dob: new Date(),
    phone: "(999)999-9999",
    email: "motelmartian@gmail.com",
    address: "123 Main St, Riverside, CO 12345",
    permission: "manager",
    password: "CMSC495@UMUC"
    })
	.then(function () {
		console.log("New User Created");
	})
	.catch(function (err) {
		console.log(err);
	});

/** Node mailer example use
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');
var adminEmailList = 'motelmartian@gmail.com, rcarle3911@gmail.com, jordanf08@gmail.com, jwmooreiv@gmail.com, dsteele0301@gmail.com, smith.glenisha@me.com, audioinstalr@yahoo.com, blacksmith_22@yahoo.com, fish5802@gmail.com';

var mailOptions = {
	from: '"Martian Motel" <motelmartian@gmail.com>',
	to: 'adminEmailList',
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
**/

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true}));

// Routes
app.use('/app', require('./controllers/app.controller'));
app.use('/emp', require('./controllers/emp.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// Runs git pull and restarts node server
app.get('/update', function (req, res) {
	const { spawn } = require('child_process');
	const deploySh = spawn('sh', ['hotel.sh'], {
        cwd: '/home/alarm'});
	return res.redirect('/app');
});

app.listen(3000);
console.log("Server running on port 3000");