var roomService = require('services/room.service.js');
var roomTypeService = require('services/roomType.service.js');

var osprey = require('osprey');
var join = require('path').join;
var raml = join(__dirname, '../', 'api.raml');
var handler = osprey.server(raml);
var router = osprey.Router({ ramlUriParameters: handler.ramlUriParameters }); 

// Routes to receive HTTP requests
router.get('/', getRooms);
router.post('/', addRoom);
router.get('/type', getRoomTypes);
router.get('/available', getAvailRooms);
router.post('/type', addRoomType);
router.get('/type/{_id}', getRmTypeById);
router.put('/type/{_id}', editRmType);
router.delete('/type/{_id}', deleteRmType);
router.get('/{_id}', getRoomByID);
router.put('/{_id}', editRoom);
router.delete('/{_id}', deleteRoom);
router.patch('/{_id}', toggleRoom);

module.exports = router;

function getRooms(req, res) {
    roomService.getRooms()
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Rooms Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getRoomByID(req, res) {
    console.log("Get Room By ID");
    console.log(req.params);
    roomService.getRoomByID(req.params._id)
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Room Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function addRoom(req, res) {
    roomService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function editRoom(req, res) {
    roomService.edit(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function deleteRoom(req, res) {
    roomService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function toggleRoom(req, res) {
    req.body.avail = !req.body.avail;
    roomService.edit(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAvailRooms(req, res) {
    roomService.getAvailRooms(req.params.space)
        .then(function (rooms) {
            res.send(rooms);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getRoomTypes(req, res) {
    console.log("GET ROOM TYPES");
    roomTypeService.getAll()
        .then(function (rmTypes) {
            res.send(rmTypes);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addRoomType(req, res) {
    roomTypeService.create(req.body)
        .then(function () {
            res.status(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getRmTypeById(req, res) {
    roomTypeService.getById(req.params._id)
        .then(function (rmType) {
            res.send(rmType);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function editRmType(req, res) {
    roomTypeService.edit(req.params._id, req.body)
        .then(function () {
            res.status(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteRmType(req, res) {
    roomTypeService.delete(req.params._id)
        .then(function () {
            res.status(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}