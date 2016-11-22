var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms']);

var service = {};

service.create = create;

module.exports = service;

function create(rmParam) {
    var deferred = Q.defer();
    return deferred.promise;
}