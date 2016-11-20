require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt')
var config = require('config.json');

/** Node mailer example use
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
**/

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUnitialized: true}));

// Using JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// Routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/contacts', require('./controllers/api/contacts.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

app.get('/update', function (req, res) {
	const { spawn } = require('child_process');
	const deploySh = spawn('sh', ['hotel.sh'], {
        cwd: '/home/alarm'});
	return res.redirect('/app');
});

app.listen(3000);
console.log("Server running on port 3000");