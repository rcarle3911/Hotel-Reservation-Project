var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/users.service');

// Routes to receive HTTP requests
router.post('/register', register);
router.post('/authenticate', login);

module.exports = router;

function login(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                req.session.token = token;

                res.send({ token: token });
            } else {
                // authentication failed
                /**
                 * @todo Fix service to send null for authentication failure.
                 */
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}