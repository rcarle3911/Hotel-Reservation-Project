var express = require('express');
var router = express.Router();

// Serve angular app files from the '/emp' route
router.use('/', express.static('login'));

module.exports = router;