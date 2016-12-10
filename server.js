require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true}));

// Secures API with JWT
app.use('/api/protected', expressJwt({ secret: config.secret }));

// Routes
app.use('/app', require('./controllers/app.controller'));
app.use('/emp', require('./controllers/emp.controller'));
app.use('/login', require('./controllers/login.controller'));
app.use('/api', express.static('./controllers/api'));
app.use('/api/public/users', require('./controllers/api/public/users.controller.js'));
app.use('/api/public/reservation', require('./controllers/api/public/reservation.controller.js'));
app.use('/api/protected/users', require('./controllers/api/protected/users.controller.js'));
app.use('/api/protected/room', require('./controllers/api/protected/room.controller.js'));
app.use('/api/protected/reservation', require('./controllers/api/protected/reservation.controller.js'));

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

//Runs database tests
//var test = require('test');