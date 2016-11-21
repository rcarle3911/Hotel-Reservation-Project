require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('config.json');

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

test();
/**
 * Testing function
 */
function test() {
var admin = {
    firstName: "John",
    lastName: "Smith",
    dob: new Date(),
    phone: "(999)999-9999",
    email: "motelmartian@gmail.com",
    address: "123 Main St, Riverside, CO 12345",
    permission: "manager",
    password: "CMSC495@UMUC"
    },
	
	rsrv = {
		userEmail: admin.email,
		roomID: null,
		startDate: new Date("12/20/2016"),
		endDate: new Date("12/30/2016"),
		numGuests: 3,
		price: 72.34
	},
	
	userService = require('services/users.service'),
	resrvService = require('services/reservation.service');

userService.create(admin)
	.then(function () {
		console.log("New User Created");
	})
	.catch(function (err) {
		console.log(err);
	});

resrvService.create(rsrv)
	.then(function () {
		console.log("New Reservation Created");
	})
	.catch(function (err) {
		console.log(err);
	});
}