var config = require('config.json');
var express = require('express');
var app = express();
var router = express.Router();
var resService = require('services/reservation.service.js');

// Routes to receive HTTP requests
router.get('/', getFutureRes);
router.post('/', reserve);
router.get('/check', isAvailable);
router.get('/past', getPastRes);
router.get('/current', getPresentRes);
router.get('/:_id', getResByID);
router.put('/:_id', editRes);
router.delete('/:_id', deleteRes);
router.get('/find', findRes);

module.exports = router;

function getFutureRes(req, res) {
    resService.getFutureRes()
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Reservation Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getPastRes(req, res) {
    resService.getPastRes()
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Reservation Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getPresentRes(req, res) {
    resService.getPresentRes()
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Reservation Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getResByID(req, res) {
    resService.getResByID(req.params._id)
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("Reservation Not Here");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

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
	resService.isAvailable(req.body)
	.then(function(stuff) {
		//res.sendStatus(200); //# of rooms available?
		if(stuff) res.send(stuff);
		else res.status(400).send("Nope");
	})
	.catch(function(err){
		res.status(400).send(err);
	});
}

function editRes(req, res) {
    res.status(501).send('Service not defined');
}

function deleteRes(req, res) {
    res.status(501).send('Service not defined');
}

function findRes(req, res) {
    res.status(501).send('Service not defined');
}
