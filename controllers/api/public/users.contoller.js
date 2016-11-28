var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// Routes to receive HTTP requests
router.get('/', getUsers);
router.post('/', register);
router.post('/authenticate', login);
router.get('/current', getCurrentUser);
router.get('/:_id', getUserByID);
router.put('/:_id', editUser);
router.delete('/:_id', deleteUser);
router.get('/invoice/:id', getInvoice);

module.exports = router;

function getInvoice(req, res) {
    res.status(501).send('Service not defined');
}

function getUserByID(req, res) {
    res.status(501).send('Service not defined');
}

function login(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
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

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function editUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        /**
         * @todo protected path will allow employees and managers to edit anyone.
         */
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        /**
         * @todo protected path will allow employees to delete any customer. managers can delete anyone.
         */
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}