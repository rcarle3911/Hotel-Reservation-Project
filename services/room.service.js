var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms']);

var service = {};

service.create = create;
service.delete = _delete;
service.delByRmNum = delByRmNum;
service.edit = edit;
service.countByType = countByType;
service.getRmByType = getRmByType;
service.countBySpace = countBySpace;
service.getRmBySpace = getRmBySpace;
service.getRooms = getRooms;
service.getRmByNum = getRmByNum;

module.exports = service;

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

function delByRmNum(num) {
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
            type: rmParam.type,
            num: rmParam.num,
            avail: rmParam.avail
        };

    db.rooms.findAndModify({
        query: {_id: mongojs.ObjectID(_id) },
        update: {$set: set},
        new: true},
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function countByType(type) {
    var deferred = Q.defer();

    db.rooms.count( 
        { type: type },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function getRmByType(type) {
    var deferred = Q.defer();

    db.rooms.find(
        { type: type },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );
    
    return deferred.promise;
}

function countBySpace(numAdults, numChild) {
    var deferred = Q.defer();

    deferred.resolve();
    
    return deferred.promise;
}

function getRmBySpace(numAdults, numChild) {
    var deferred = Q.defer();

    deferred.resolve();
    
    return deferred.promise;
}

function getRooms() {
    var deferred = Q.defer();

    deferred.resolve();
    
    return deferred.promise;
}

function getRmByNum(rmNum) {
    var deferred = Q.defer();

    deferred.resolve();
    
    return deferred.promise;
}