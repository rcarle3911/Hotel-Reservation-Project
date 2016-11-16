var config = require('config.json');
var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('contacts', ['contacts']);
//db.bind('contacts');

var service = {};

service.getContacts = getContacts;
service.insertContact = insertContact;
service.deleteContact = deleteContact;
service.findContact = findContact;
service.updateContact = updateContact;

module.exports = service;

function getContacts() {
    var deferred = Q.defer();
    console.log("Service getContacts")
    db.contacts.find(function (err, docs) {
        if (err) deferred.reject(err.name + ": " + err.message);
        console.log("getContacts: ");
        console.log(docs);
        deferred.resolve(docs);
    });

    return deferred.promise;
}

function insertContact(contact){
    console.log("Service insertContact received: ");
    for (var property in contact) {        
        if(contact.hasOwnProperty(property)) {
            console.log(property + ": " + contact[property]);
        }
    }

    var deferred = Q.defer();
   
    db.contacts.insert(contact, function (err, doc) {
        deferred.resolve(doc);
    });

    return deferred.promise;
}

function deleteContact(_id){
    console.log("Service deleteContact() received: ");
    console.log(_id);

    var deferred = Q.defer();
    db.contacts.remove({_id: mongojs.ObjectID(_id) },
        function (err, doc) {
            deferred.resolve(doc);
        });

    return deferred.promise;
}

function findContact(_id){
    console.log("Service findContact() received: ");
    console.log(_id);

    var deferred = Q.defer();
    db.contacts.findOne({_id: mongojs.ObjectID(_id) },
        function (err, doc) {
            deferred.resolve(doc);
        });

    return deferred.promise;
}

function updateContact(_id, contact){
    console.log("Service updateContact() received: ");
    console.log(_id + " : ");
    for (var property in contact) {        
        if(contact.hasOwnProperty(property)) {
            console.log(property + ": " + contact[property]);
        }
    }

    var deferred = Q.defer();
    db.contacts.findAndModify({
        query: {_id: mongojs.ObjectID(_id) },
        update: {$set: {name: contact.name, email: contact.email, number: contact.number}},
        new: true}, function (err, doc) {
            deferred.resolve(doc);
        });

    return deferred.promise;
}
