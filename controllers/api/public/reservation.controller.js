var config = require('config.json');
var express = require('express');
var osprey = require('osprey');
var join = require('path').join;
var raml = join(__dirname, 'controllers', 'api', 'api.raml');
var resService = require('services/reservation.service.js');

var handler = osprey.server(raml);
//var router = osprey.Router({ ramlUriParameters: handler.ramlUriParameters }); //express.Router();
var router = express.Router();

// Routes to receive HTTP requests
router.post('/', reserve);
router.get('/check', isAvailable);

module.exports = router;

function reserve(req, res) {
	console.log("Request received");
    resService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function isAvailable(req, res) {
	req.query.space = Number.parseInt(req.query.space);
	console.log(req.query);
	resService.isAvailable(req.query)
	.then(function(stuff) {
		res.sendStatus(200);
	})
	.catch(function(err){
		res.status(400).send(err);
	});
}