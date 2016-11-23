var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms']);

var service = {};

service.create = create;
service.delete = _delete;
service.delByRmNum = delByRmNum;
service.edit = edit;
service.getRmCntByType = getRmCntByType;
service.getRmByType = getRmByType;
service.getRmCntBySpace = getRmCntBySpace;
service.getRmBySpace = getRmBySpace;
service.getRooms = getRooms;
service.getRmByNum = getRmByNum;

module.exports = service;

function create(rmParam) {
    var deferred = Q.defer();

    db.rooms.insert(
        rmParam,
        function (err, docs) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(docs);
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

function delByRmNum(rmNum) {
    var deferred = Q.defer();

    db.rooms.remove(
        { rmNum: rmNum },
        function (err, docs) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(docs);
        }
    );

    return deferred.promise;
}

function edit(rnParam) {
    var deferred = Q.defer();

    deferred.resolve();

    return deferred.promise;
}

function getRmCntByType(rmType) {
    var deferred = Q.defer();

    deferred.resolve();

    return deferred.promise;
}

function getRmByType(rmType) {
    var deferred = Q.defer();

    deferred.resolve();
    
    return deferred.promise;
}

function getRmCntBySpace(numAdults, numChild) {
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