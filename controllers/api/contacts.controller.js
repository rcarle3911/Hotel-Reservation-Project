var config = require('config.json');
var express = require('express');
var router = express.Router();
var contactService = require('services/contact.service');

// contact list routes
router.get('/', getContacts);
router.post('/', insertContact);
router.delete('/:_id', deleteContact);
router.get('/:_id', findContact);
router.put('/:_id', updateContact);

module.exports = router;

function getContacts(req, res){
    console.log('Router received a GET request');

    contactService.getContacts()
        .then(function (docs) {
            console.log("Router sent: ");
            console.log(docs);
            res.send(docs);
        })
        .catch(function (err) {
            res.send({});
        });
}

function insertContact(req, res){
    console.log("Router insertContact received:" + req.body);
    for (var property in req.body) {
        if(req.body.hasOwnProperty(property)) {
            console.log(property + " : " + req.body[property]);
        }
    }

    contactService.insertContact(req.body)
        .then(function (doc) {
            res.send(doc);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteContact(req, res){
    console.log("Router deleteContact received: " + req.params._id);

    contactService.deleteContact(req.params._id)
        .then(function (doc) {
            res.send(doc);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function findContact(req, res){
    console.log("Router findContact received: " + req.params._id);

    contactService.findContact(req.params._id)
        .then(function (doc) {
            res.json(doc);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateContact(req, res){
    console.log("Router updateContact received: " + req.params._id);

    contactService.updateContact(req.params._id, req.body)
        .then(function (doc) {
            res.json(doc);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });    
}

