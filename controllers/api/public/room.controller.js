var express = require('express');
var roomService = require('services/room.service.js');
var roomTypeService = require('services/roomType.service.js');

var osprey = require('osprey');
var join = require('path').join;
var raml = join(__dirname, 'controllers', 'api', 'api.raml');
var handler = osprey.server(raml);
var router = osprey.Router({ ramlUriParameters: handler.ramlUriParameters }); 

// Routes to receive HTTP requests
router.get('/type', getRoomTypes);

module.exports = router;

function getRoomTypes(req, res) {
    roomTypeService.getAll()
        .then(function (rmTypes) {
            res.send(rmTypes);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}