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
router.get('/invoice/:_id', getInvoice);
router.get('/email/:email', getUserByEmail);

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
    
    var userId = req.user.sub;
    if (req.params._id !== userId && req.user.group < 1) {
        return res.status(401).send('You can only update your own account');
    }

    userService.edit(req.params._id, req.body)
        .then(function () {
            if (req.user.group > 1 && req.body.group != null) {
                userService.editGroup(req.params._id, req.body.group)
                .then(function () {
                    res.sendStatus(200);
                })
                .catch(function (err) {
                    res.status(400).send(err);
                })
            } else res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId || req.user.group < 1) {
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

function getUserByEmail(req, res) {
    userService.getUserByEmail(req.params.email)
        .then(function (user) {
            if (!user) res.status(404).send("No user found with " + req.params.email);
            else res.send(user);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}