var config = require('../../../config.json');
var express = require('express');
var app = express();
var router = express.Router();
var resService = require('../../../services/reservation.service.js');

// Routes to receive HTTP requests
router.get('/', getFutureRes);
router.post('/', reserve);
router.get('/check', isAvailable);
//router.post('/', register);
//router.post('/authenticate', login);
//router.get('/current', getCurrentUser);
//router.get('/:_id', getUserByID);
//router.put('/:_id', editUser);
//router.delete('/:_id', deleteUser);
//router.get('/invoice/:id', getInvoice);

module.exports = router;

function getFutureRes(req, res) {
    resService.getFutureRes()
    .then( function (list) {
        if (list) res.send(list);
        //else res.status(404)
        else res.status(400).send("User Not Here");
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