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
app.use('/login', require('./controllers/login.controller'));

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

//test();
/**
 * Testing function
 */
function test() {
	var group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	}),

	user = {
		firstName: "John",
		lastName: "Smith",
		dob: new Date(),
		phone: "(999)999-9999",
		email: "motelmartian@gmail.com",
		address: "123 Main St, Riverside, CO 12345",
		group: group.MANAGER,
		password: "CMSC495@UMUC"
    },

	rmType = {
		name: "Double Queen Deluxe",
		desc: "Text that makes you want this room",
		space: 4
	},

	room = {
		type: rmType,
		num: 103,
		avail: false
	},
	
	rsrv = {
		userEmail: user.email,
		roomType: rmType,
		startDate: new Date("12/20/2016"),
		endDate: new Date("12/30/2016"),
		numGuests: 3,
		price: 72.34
	},

	payDetail = {
		userID: user._id || 0, // Get from db
		num: "1234123412341234",
		exp: new Date(2020, 12, 31),
		cvv: "123",
	},

	payment = {
		resID: rsrv._id || 0, // Get from db
		payID: payDetail._id || 0 // Get from db
	},
	
	userService = require('services/users.service'),
	resrvService = require('services/reservation.service'),
	roomService = require('services/room.service');

	//createUser();
	//createRoom();
	//createRes();
	//roomService.update();
	//testRoomFunctions();

	function createUser() {
		userService.create(user)
			.then(function (doc) {
				console.log("New User Created");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
	}

	function createRes() {
		resrvService.create(rsrv)
			.then(function (doc) {
				console.log("New Reservation Created")
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			})
	}
	
	function createRoom() {
		roomService.create(room)
			.then(function (doc) {
				console.log("New Room Created");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
	}

	function testRoomFunctions() {

		roomService.getRooms()
		.then(function (roomList) {
			console.log("Room List");
			console.log(roomList);
			roomService.getAvailRooms()
			.then(function (aRoomList) {
				console.log("Available Room List");
				console.log(aRoomList);
			})
			.catch(function(err) {
				console.log(err);
			});
		})
		.catch(function (err) {
			console.log(err);
		});

	}

		
}

