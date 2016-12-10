(function() {
	var group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	}),

	user = {
		firstname: "John",
		lastname: "Smith",
		dob: new Date(),
		phone: "(999)999-9999",
		email: "motelmartian@gmail.com",
		address: "123 Main St, Riverside, CO 12345",
		group: group.MANAGER,
		password: "CMSC495@UMUC"
    },
	users = [],

	rmType = {
		name: "King Suite",
		desc: "Text that makes you want this room",
		space: 3
	},
	rmTypes = [],

	room = {
		rmType: null, //Must get from DB
		num: 200,
		avail: true
	},
	rooms = [],
	
	rsrv = {
		userEmail: user.email,
		roomType: null, //Must get from DB
		startDate: new Date("12/20/2016"),
		endDate: new Date("12/30/2016"),
		numGuests: 3,
		price: 72.34
	},
	reservations = [],

	payDetail = {
		userEmail: user.email,
		num: "1234123412341234",
		exp: new Date(2020, 12, 31),
		cvv: "123",
	},

	payment = {
		resID: null, // Get from db
		payID: null // Get from db
	},
	
	userService = require('services/users.service'),
	resrvService = require('services/reservation.service'),
	roomService = require('services/room.service'),
	roomTypeService = require('services/roomType.service');

	createUser();
	//createRoom();
	//createRes();
	//roomService.update();
	//testRoomFunctions();

	function createUser() {
		userService.create(user)
			.then(function (doc) {
				console.log("New User Created");
				console.log(doc);
				getUserId();
			})
			.catch(function (err) {
				console.log(err);
				getUserId();
			});
	}

	function getUserId() {
		userService.getUserByEmail(user.email)
			.then(function (dbUser) {
				console.log(dbUser._id);
				user._id = dbUser._id;
				createRoomTypes();
			})
			.catch(function (err) {
				console.log(err);
				createRoomTypes();
			});
	}

	function createRoomTypes() {
		var names = [
			"King Suite",
			"Double Queen",
			"King Deluxe",
			"Double Queen Deluxe",
			"Queen Suite",
			"Queen Deluxe"
		],
		rmTypeInput = null;

		for (var i = 0; i < names.length; i++) {
			rmTypeInput = JSON.parse(JSON.stringify(rmType));
			rmTypeInput.name = names[i];
			roomTypeService.create(rmTypeInput)
			.then(function (doc) {
				console.log("New Room Type Created");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
		}

		setTimeout(getRmTypes, 5000);
	}

	function getRmTypes() {
		roomTypeService.getAll()
		.then(function (doc) {
			console.log(doc);
			rmTypes = doc;
			createRooms();
		})
		.catch(function (err) {
			console.log(err);
		});
	}

	function createRooms() {
		for (var i = 0; i < 10; i ++) {
			var roomInput = JSON.parse(JSON.stringify(room));
			roomInput.num += i;
			roomInput.rmType = rmTypes[i % rmTypes.length]._id;
			roomService.create(roomInput)
			.then(function (doc) {
				console.log("New Room Created");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
		}

		setTimeout(getRooms, 5000);
	}

	function getRooms() {
		roomService.getRooms()
		.then(function (doc) {
			rooms = doc;
			createRes();
		})
		.catch(function (err) {
			console.log(err);
		});
	}

	function createRes() {
		for (var i = 0; i < 20; i++) {
			var rsrvInput = JSON.parse(JSON.stringify(rsrv));
			rsrvInput.roomType = rmTypes[i % rmTypes.length]._id;
			resrvService.create(rsrvInput)
			.then(function (doc) {
				console.log("New Reservation Created")
				console.log(doc);
			})
			.catch(function (err) {
				console.log("Reservation failed");
				console.log(err);
			});
		}

		setTimeout(getRes, 30000);		
	}

	function getRes() {
		resrvService.getFutureRes()
		.then(function (doc) {
			reservations = doc;
			checkIn();
		})
		.catch(function (err) {
			console.log(err);
		});
	}

	function checkIn() {
		for (var i = 0; i < reservations.length; i++) {
			resrvService.checkInOut(reservations[i]._id, new Date("12/20/2016"))
			.then(function (doc) {
				console.log("Checked In!");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
		}

		setTimeout(checkOut, 5000);
	}

	function checkOut() {
		for (var i = 0; i < reservations.length; i++) {
			resrvService.checkInOut(reservations[i]._id, new Date("12/30/2016"))
			.then(function (doc) {
				console.log("Checked Out!");
				console.log(doc);
			})
			.catch(function (err) {
				console.log(err);
			});
		}
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


})();