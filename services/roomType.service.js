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
service.getById = getById;

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

function edit(_id, rmType) {
    var deferred = Q.defer(),
        set = {
            name: rmType.name,
            desc: rmType.desc,
            space: rmType.space
        };

    db.rmTypes.findOne( //enforces unique room type names
        { name: rmType.name },
        function (err, foundType) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (foundType && foundType._id !== _id) {
                deferred.reject('Room Type with name ' + rmType.name + ' already exists.');
            } else {
                db.rmTypes.findAndModify({
                    query: {_id: mongojs.ObjectID(_id) },
                    update: {$set: set},
                    new: true
                    },
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

function _delete(_id) {
    var deferred = Q.defer();

   db.rmTypes.remove(
       { _id: mongojs.ObjectID(_id) },
       function (err, docs) {
           if (err) deferred.reject(err.name + ': ' + err.message);
           deferred.resolve(docs);
       }
   );

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.rmTypes.findOne(
        { _id: mongojs.ObjectID(_id) },
        function (err, room) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(room);
        }
    );
    
    return deferred.promise;
}