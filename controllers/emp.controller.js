var express = require('express');
var router = express.Router();

// serve angular app files from the '/emp' route
router.use('/', express.static('emp'));

module.exports = router;