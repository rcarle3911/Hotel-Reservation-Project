var express = require('express');
var router = express.Router();

// First function to run should log the user out.
router.use('/', function (req, res, next) {
    delete req.session.token;
    next();
});

// Serve angular app files from the '/emp' route
router.use('/', express.static('login'));

module.exports = router;