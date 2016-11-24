var Q = require('q');
var fs = require('fs');
var config = require('config.json');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['rooms']);
	
var service = {};

service.create = create;
service.delete = _delete;
service.delByRmNum = delByRmNum;
service.edit = edit;
service.getRmByType = getRmByType;
service.getRmBySpace = getRmBySpace;
service.getRooms = getRooms;
service.getRmByNum = getRmByNum;
service.update = update;

module.exports = service;

/**
 * Grabs a list of distinct types from the rooms database.
 * Counts how many of each type in the list exist in the rooms database.
 * Writes the value to config.json.
 * Repeats the process for distinct space values. 
 */
function update() {    
    // Wipe rooms data
    config.rooms = {"type": {}, "space": {}};

    getTypeList()
    .then(function (types) {
        var len, i;
        len = types.length;
        for (i = 0; i < len; i++) {
            countType(types[i])
            .then(function(doc) {
                writeData(doc);
            });
        }
    });

    getSpaceList()
    .then(function (spaces) {
        var len, i;
        len = spaces.length;
        for (i = 0; i < len; i++) {
            countSpace(spaces[i])
            .then(function (doc) {
                writeData(doc);
            });
        }
    });

    function getSpaceList() {
        var deferred = Q.defer();
        db.rooms.distinct(
            "type.space",
            null,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            }
        );
        return deferred.promise;
    }

    function getTypeList() {
        var deferred = Q.defer();
        db.rooms.distinct(
            "type", 
            null, 
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            }
        );
        return deferred.promise;
    }

    function countType(type) {
        var deferred = Q.defer();
        db.rooms.count(
            { type: type },
            function (err, doc) {
                if (err) return err.name + ': ' + err.message;
                var result = {cat: "type", key: type.name, value: (doc + "")};
                deferred.resolve(result);
            }
        );
        return deferred.promise;
    }

    function countSpace(space) {
        var deferred = Q.defer();
        db.rooms.count(
            { "type.space": {$gte: space}},
            function (err, doc) {
                if (err) return err.name + ': ' + err.message;
                var result = {cat: "space", key: (space + ""), value: (doc + "")}
                return deferred.resolve(result);
            }
        );
        return deferred.promise;
    }

    function writeData(result) {
        config["rooms"][result.cat][result.key] = result.value;
        fs.writeFileSync('config.json', JSON.stringify(config, null, '\t'));
    }
}

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
                        update();
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
            update();
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
            update();
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
            update();
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