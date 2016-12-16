var roomService = require('services/room.service.js');
var roomTypeService = require('services/roomType.service.js');

var osprey = require('osprey');
var router = osprey.Router(); 

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