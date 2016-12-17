var resService = require('services/reservation.service.js');

//API Validations
var osprey = require('osprey');
var router = osprey.Router(); 

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
	resService.isAvailable(req.query)
	.then(function(stuff) {
		res.sendStatus(200);
	})
	.catch(function(err){
		res.status(400).send(err);
	});
}