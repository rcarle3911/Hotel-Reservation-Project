var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms']);

var service = {};

service.create = create;
service.delete = _delete;

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

function deleteByRmNum(rmNum) {
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