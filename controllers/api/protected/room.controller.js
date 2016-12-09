var config = require('config.json');
var express = require('express');
var app = express();
var router = express.Router();
var roomService = require('services/room.service.js');
var roomTypeService = require('services/roomType.service.js');

// Routes to receive HTTP requests
router.get('/', getRooms);
router.post('/', addRoom);
router.get('/:_id', getRoomByID);
router.put('/:_id', editRoom);
router.delete('/:_id', deleteRoom);
router.patch('/:_id', toggleRoom);
router.get('/available', getAvailRooms);
router.get('/type', getRoomTypes);
router.post('/type', addRoomType);
router.get('/type/:_id', getRmTypeByID);
router.put('/type/:_id', editRmType);
router.delete('/type/:_id', deleteRmType);

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
    res.status(501).send("Work in progress");
}

function getRoomTypes(req, res) {
    res.status(501).send("Work in progress");
}

function addRoomType(req, res) {
    res.status(501).send("Work in progress");
}

function getRmTypeByID(req, res) {
    res.status(501).send("Work in progress");
}

function editRmType(req, res) {
    res.status(501).send("Work in progress");
}

function deleteRmType(req, res) {
    res.status(501).send("Work in progress");
}