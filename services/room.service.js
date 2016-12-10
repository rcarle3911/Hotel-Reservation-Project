var Q = require('q');
var fs = require('fs');
var config = require('config.json');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms', 'rmTypes']);
	
var service = {};
    group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	});

service.create = create;
service.delete = _delete;
service.delRmByNum = delRmByNum;
service.edit = edit;
service.getRoomByID = getRoomByID;
service.getRmByType = getRmByType;
service.getAvailRmByType = getAvailRmByType;
service.getRmBySpace = getRmBySpace;
service.getAvailRmBySpace = getAvailRmBySpace;
service.getRooms = getRooms;
service.getAvailRooms = getAvailRooms;
service.getRmByNum = getRmByNum;
service.countRmByType = countRmByType;
service.countRmBySpace = countRmBySpace;

module.exports = service;

/**
 * Enforces unique room numbers
 */
function create(rmParam) {
    var deferred = Q.defer();
    
    db.rooms.findOne(
        { num: rmParam.num },
        function (err, room) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (room) {
                //Room Number is already in database
                deferred.reject('Room Number ' + rmParam.num + ' is already in the database. Use edit to make changes.');
            } else {
                db.rooms.insert(
                    rmParam,
                    function (err, docs) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve(docs);
                    }
                );
            }
        }
    );

    return deferred.promise;
}

function getRoomByID(_id) {
    var deferred = Q.defer();
    db.rooms.findOne(
        { _id: mongojs.ObjectID(_id) },
        function (err, room) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(room);
        }
    );
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.rooms.remove(
        { _id: mongojs.ObjectID(_id) },
        function (err, docs) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(docs);
        }
    );

    return deferred.promise;
}

function delRmByNum(num) {
    var deferred = Q.defer();

    db.rooms.remove(
        { num: num },
        function (err, docs) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(docs);
        }
    );

    return deferred.promise;
}

function edit(_id, rmParam) {
    var deferred = Q.defer(),
        set = {
            rmType: rmParam.rmType,
            num: rmParam.num,
            avail: rmParam.avail
        };

    db.rooms.findOne( //enforces unique room numbers
        { num: rmParam.num },
        function (err, foundRoom) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (foundRoom && foundRoom._id !== _id) {
                deferred.reject('Room number ' + rmParam.num + ' already exists');
            } else {
                db.rooms.findAndModify({
                    query: {_id: mongojs.ObjectID(_id) },
                    update: {$set: set},
                    new: true},
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve(doc);
                    }
                );
            }
        }
    );

    return deferred.promise;
}

function getRmByType(rmTypeId) {
    var deferred = Q.defer();

    db.rooms.find(
        { rmType: rmTypeId },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );
    
    return deferred.promise;
}

function getAvailRmByType(rmTypeId) {
    var deferred = Q.defer();

    db.rooms.find(
        { $and: 
            [{ rmType: rmTypeId },
            { avail: true }]
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function getRmBySpace(space) {
    var deferred = Q.defer();

    db.rooms.find(
        { "type.space" : { $gte: space } },
        function (err, doc) {
            if (err) deferred.resolve(err);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function getAvailRmBySpace(space) {
    var deferred = Q.defer();

    db.rooms.find(
        { $and: 
            [{ "type.space": 
                { $gte: space }
            },
            { avail: true }]
        },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );
    
    return deferred.promise;
}

function getRooms() {
    var deferred = Q.defer();

    db.rooms.find({}, function (err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(doc);
    })
    
    return deferred.promise;
}

function getAvailRooms() {
    var deferred = Q.defer();

    db.rooms.find(
        { avail: true },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function getRmByNum(rmNum) {
    var deferred = Q.defer();

    db.rooms.findOne(
        { num: rmNum }, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );
    
    return deferred.promise;
}

function countRmByType(_id) {
    var deferred = Q.defer();

    db.rooms.count(
        { rmType: _id },
        function (err, count) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(count);
        }
    );

    return deferred.promise;
};

function countRmBySpace (space) {
    var deferred = Q.defer()

    db.rmTypes.find(
        { space: {$gte: space} }, //Returns an array of room types that meet the space requirement
        function (err, rmTypes) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            db.rooms.count(
                { rmType: { $in: rmTypes } }, //Counts the number of rooms that have a type in the array
                function (err, count) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve(count);
                }
            );
        }
    );

    return deferred.promise;
}