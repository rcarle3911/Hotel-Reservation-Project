var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/users.service');

// Routes to receive HTTP requests
router.get('/', getUsers);
router.get('/current', getCurrentUser);
router.get('/:_id', getUserByID);
router.put('/:_id', editUser);
router.delete('/:_id', deleteUser);
router.get('/invoice/:id', getInvoice);

module.exports = router;

function getUsers(req, res) {
    userService.getUsers()
    .then( function (users) {
        if (users) res.send(users);
        else res.status(404)
    })
    .catch( function(err) {
        res.status(400).send(err);
    });
}

function getInvoice(req, res) {
    res.status(501).send('Service not defined');
}

function getUserByID(req, res) {
    res.status(501).send('Service not defined');
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
    /**
     * @todo give this api access to the JWT token
     */
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
    console.log(req.user);
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