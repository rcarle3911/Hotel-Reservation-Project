//var express = require('express');
//var router = express.Router();
var userService = require('services/users.service');

var osprey = require('osprey');
var join = require('path').join;
var raml = join(__dirname, 'controllers', 'api', 'api.raml');
//var handler = osprey.server(raml);
var router = osprey.Router();

// Routes to receive HTTP requests
router.post('/register', register);
router.post('/authenticate', login);
router.post('/forgotPass', forgotPass);

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
    console.log(req.body);
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function forgotPass(req, res) {
    userService.forgotPass(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}