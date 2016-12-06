var express = require('express');
var router = express.Router();

router.get('/token', function (req, res) {
    if (req.session.token) res.send(req.session.token);
    else res.send(null);
});

// Serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;

