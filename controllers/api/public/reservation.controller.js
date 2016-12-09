var config = require('config.json');
var express = require('express');
var app = express();
var router = express.Router();
var resService = require('services/reservation.service.js');

// Routes to receive HTTP requests
router.post('/', reserve);
router.get('/check', isAvailable);

module.exports = router;

function reserve(req, res) {
    resService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function isAvailable(req, res) {
	resService.isAvailable(req.params)
	.then(function(stuff) {
		//res.sendStatus(200); //# of rooms available?
		if(stuff) res.send(stuff);
		else res.status(400).send("Nope");
	})
	.catch(function(err){
		res.status(400).send(err);
	});
}