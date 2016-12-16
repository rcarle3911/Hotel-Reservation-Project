var config = require('config.json');
var express = require('express');
var app = express();
var router = express.Router();
var resService = require('services/reservation.service.js');

// Routes to receive HTTP requests
router.get('/', getUserRes);
router.get('/past', getPastRes);
router.get('/current', getPresentRes);
router.get('/future', getFutureRes);
router.get('/find', findRes);
router.get('/:_id', getResByID);
router.put('/:_id', editRes);
router.delete('/:_id', deleteRes);
router.patch('/:_id', checkInOut);

module.exports = router;

function checkInOut(req, res) {
    resService.checkInOut(req.params._id, new Date())
    .then( function () {
        res.status(200);
    })
    .catch( function (error) {
        res.status(400).send(err);
    });
}

function getUserRes(req, res) {
    if (!req.user) return res.status(401).send("User not logged in");
    resService.getUserRes(req.user.sub)
    .then( function (list) {
        res.send(list);
    })
    .catch( function(err) {
        res.status(400).send(err);
    });    
}

function getFutureRes(req, res) {
    resService.getFutureRes()
    .then( function (list) {
        if (list) res.send(list);
        else res.status(400).send("No Reservations Found");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getPastRes(req, res) {
    resService.getPastRes()
    .then( function (list) {
        if (list) res.send(list);
        else res.status(400).send("No Reservations Found");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getPresentRes(req, res) {
    resService.getPresentRes()
    .then( function (list) {
        if (list) res.send(list);
        else res.status(400).send("No Reservations Found");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getResByID(req, res) {
    resService.getResByID(req.params._id)
    .then( function (list) {
        if (list) res.send(list);
        else res.status(400).send("No Reservations Found");
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function editRes(req, res) {
    resService.edit(req.params._id, req.body, req.user.group)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteRes(req, res) {
    resService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function findRes(req, res) {
    res.status(501).send('Service not defined');
}
