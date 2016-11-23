var express = require('express');
var router = express.Router();

router.use('/', function (req, res, next) {
    /**
     * @todo Check if user is logged in, redirect to login if not.
     * @todo Check if user is employee, display unauthorized user if not and redirect to main page
     */
    next();
})

// serve angular app files from the '/emp' route
router.use('/', express.static('emp'));

module.exports = router;