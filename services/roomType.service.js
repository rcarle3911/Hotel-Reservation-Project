var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rmTypes']);
	
var service = {};
    group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	});

service.create = create;
service.edit = edit;
service.delete = _delete;
service.getAll = getAll;

module.exports = service;

function create(rmTypeParam) {
    var deferred = Q.defer();
        db.rmTypes.findOne(
            { name: rmTypeParam.name },
            function(err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (doc) deferred.reject("Type name already exists in the database.");
                else {
                    db.rmTypes.insert(
                        rmTypeParam,
                        function(err, doc) {
                            if (err) deferred.reject(err.name + ': ' + err.message);
                            deferred.resolve(doc);
                        }
                    );
                }
            }
        );
    return deferred.promise;

}

function getAll() {
    var deferred = Q.defer();
    
    db.rmTypes.find(
        {},
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc)
        }
    );

    return deferred.promise;
}

function edit() {
    var deferred = Q.defer();

    deferred.resolve();

    return deferred.promise;
}

function _delete() {
    var deferred = Q.defer();

    deferred.resolve();

    return deferred.promise;
}