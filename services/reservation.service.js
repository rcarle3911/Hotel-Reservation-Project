var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['pastRes', 'presentRes', 'futureRes', 'users', 'rooms', 'rmTypes']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');
var config = require('config.json');
var lock;

var service = {};

service.create = create;
service.isAvailable = isAvailable;
service.getPresentRes = getPresentRes;
service.deleteFuture = deleteFuture;
service.deletePresent = deletePresent;
service.deletePast = deletePast;

module.exports = service;

function create(resrvParam) {
    var deferred = Q.defer();
    
    timeout();

    return deferred.promise;

    function timeout() {
        setTimeout(function () {
            if (!lock) {
                lock = true;
                console.log("Reservation database locked for editing");
                createRes(resrvParam)
                .then(function (doc) {
                    lock = false;
                    deferred.resolve(doc);
                })
                .catch(function (err) {
                    lock = false;
                    deferred.reject(err)
                });
            } else {
                timeout();
            }
        }, 100);
    }
}

/**
 * Creates a reservation object.
 * @param {any} resrvParam
 */
function createRes(resrvParam) {
    var deferred = Q.defer();
    var user = {firstName: "Guest"};


    db.users.findOne(
        { email: resrvParam.userEmail },
        function (err, userFound) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            else {
                if (userFound) user = userFound;
                isAvailable(resrvParam)
                .then( function() {
                    createReservation();
                })
                .catch( function(err) {
                    deferred.reject(err);
                })
            }
        }
    );

    function createReservation() {
        db.futureRes.insert(
        resrvParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            //Send email confirmation
            var htmlstream = fs.createReadStream('./services/resConfEmail.html');
            transporter.sendMail({
                from: '"Martian Motel" <motelmartian@gmail.com>',
                to: resrvParam.userEmail,
                subject: 'Welcome to the Martian Motel ' + user.firstName,
                text: 'Your reservation for ' + resrvParam.startDate + ' is booked!',
                html: htmlstream
            }, function(error, info) {
                if (error) return console.log(error);
                console.log('Message sent: ' + info.response);
            });            
            deferred.resolve(doc);
            }
        );
    }        

    return deferred.promise;
}

/**
 * Check for availability here
 */
function isAvailable(resrvParam, callback) {
    var deferred = Q.defer();
    var total = config.rooms.type[resrvParam.roomType.name];

    db.futureRes.count(
        { $and: [
            { startDate: { $lte: resrvParam.endDate } },
            { endDate: { $gte: resrvParam.startDate } },
            { roomType: resrvParam.roomType }
        ]},
        function (err, futureCount) {
            console.log("Count Result");
            console.log(futureCount);
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (futureCount >= total) {                
                deferred.reject("No Availability for " + resrvParam.roomType.name);
            } else {
                db.presentRes.count(
                    { $and: [
                        { startDate: { $lte: resrvParam.endDate } },
                        { endDate: { $gte: resrvParam.startDate } },
                        { roomType: resrvParam.roomType }
                    ]},
                    function (err, currentCount) {
                        if (err) deferred.reject(err.name + ': ' + err.message)
                        if ((futureCount + currentCount) >= total) {
                            deferred.reject("No Availability for " + resrvParam.roomType.name);
                        } else {
                            deferred.resolve();
                        }
                    }
                );
            }
        }
    );

    return deferred.promise;
    /** This algorithm will count all reservations that match the room type and any that match your date parameters.
     * We also need to count the current reservations.
    rmTypeCount(resrvParam, function(err, totCount){
        db.futureRes.find({startDate: {$gte : resrvParam.startDate, $lt : resrvParam.endDate}, rmType: resrvParam.rmType}).count(function(err, count){
            if(err) return callback(err);
            if(count <= totCount){
                callback(null, true, totCount);
            }
            else if(count > totCount){
                callback(null, false, totCount);
            }
        });
    });
    */
}

/**
 * Count by Room Types
 */
function rmTypeCount(type) {
    return config.rooms.type[type.name]
    /** If there's a database of rooms counting the database of rmtypes won't return the total.
     * This function would always return one since room types should be unique.
    db.rmTypes.find({name: resrvParam.rmType}).count(function(err, totCount){
        if(err) return callback(err);
        callback(null, totCount);
    });
    */
}

/**
 * Returns a list of current reservations
 */
function getPresentRes(){
    var deferred = Q.defer();

    db.presentRes.find(
        {},
        function(err, list){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(list);
        }
    );

    return deferred.promise;
}

/**
 * Remove a reservation. Will need the remove query to be changed depending on how we decide to delete reservations.
 * Reservations should be removed by id
 */
function deleteFuture(_id) {
    var deferred = Q.defer();

    db.futureRes.remove(
        { _id: mongojs.ObjectID(_id) },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
        }
    );

    return deferred.promise;
    /** No need to pass in the entire object
    db.futureRes.remove(resrvParam); //db.futureRes.remove(resrvParam, {justOne: true}); will remove just one entry if similar entries exist
    */
}

function deletePresent(_id) {
    var deferred = Q.defer();

    db.presentRes.remove(
        { _id: mongojs.ObjectID(_id) },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
        }
    );

    return deferred.promise;
}

function deletePast(_id) {
    var deferred = Q.defer();

    db.pastRes.remove(
        { _id: mongojs.ObjectID(_id) },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
        }
    );

    return deferred.promise;
}