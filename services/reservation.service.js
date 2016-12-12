var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['pastRes', 'presentRes', 'futureRes', 'users', 'rooms', 'rmTypes']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');
var config = require('config.json');
var lock;

var service = {};
    group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	});

service.create = create;
service.edit = edit;
service.delete = _delete;
service.isAvailable = isAvailable;
service.getPresentRes = getPresentRes;
service.deleteFuture = deleteFuture;
service.deletePresent = deletePresent;
service.deletePast = deletePast;
service.getFutureRes = getFutureRes;
service.getPastRes = getPastRes;
service.getResByID = getResByID;
service.checkInOut = checkInOut;
service.getUserRes = getUserRes;

module.exports = service;

function create(resrvParam) {
    var deferred = Q.defer();
    /*
    resrvParam = {
        userEmail: resrvParam.userEmail,
        roomType: resrvParam.roomType,
        startDate: new Date(resrvParam.startDate),
        endDate: new Date(resrvParam.endDate),
        numGuests: resrvParam.numGuests,
        price: resrvParam.price,
    }
    */
    timeout(createRes, resrvParam, null, deferred);

    return deferred.promise;

}

function timeout(toRun, param1, param2, deferred) {
    setTimeout(function () {
        if (!lock) {
            console.log("Checking for availability");
            lock = true;
            toRun(param1,param2)
            .then(function (doc) {
                lock = false;
                deferred.resolve(doc);
            })
            .catch(function (err) {
                lock = false;
                deferred.reject(err)
            });
        } else {
            console.log("Reservation database locked for editing");
            timeout(toRun, param1, param2, deferred);
        }
    }, 100);
}

function edit(_id, resrvParam) {
    var deferred = Q.defer();
    
    timeout(editRes, _id, resrvParam, deferred);

    return deferred.promise;    
}

function editRes(_id, resrvParam, group) {
    var deferred = Q.defer()
    
    isAvailable(resrvParam)
    .then( function () {
        var set = {
            userEmail: resrvParam.userEmail,
            roomType: resrvParam.roomType,
            startDate: resrvParam.startDate,
            endDate: resrvParam.endDate,
            numGuests: resrvParam.numGuests,
            price: resrvParam.price
        };

        //Only employees and managers can directly set check in and check out dates.
        if (group > 0) {
            if (resrvParam.checkIn) set.checkIn = resrvParam.checkIn;
            if (resrvParam.checkIn) set.checkOut = resrvParam.checkOut;
        }
        /**
         * This chain will check the future, present, and past databases for a id match.
         * Once it's found it's removed and the chain stops.
         */
        db.futureRes.findAndModify({
            query: {_id: mongojs.ObjectID(_id) },
            update: {$set: set},
            new: true},
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (doc) deferred.resolve(doc);
                else { //Not found in future database
                    db.presentRes.findAndModify({
                        query: {_id: mongojs.ObjectID(_id) },
                        update: {$set: set},
                        new: true},
                        function (err, doc) {
                            if (err) deferred.reject(err.name + ': ' + err.message);
                            if (doc) deferred.resolve(doc);
                            else { //Not found in present database
                                db.pastRes.findAndModify({
                                    query: {_id: mongojs.ObjectID(_id) },
                                    update: {$set: set},
                                    new: true},
                                    function (err, doc) {
                                        if (err) deferred.reject(err.name + ': ' + err.message);
                                        //Resolve whether or not it was found.
                                        deferred.resolve(doc);
                                    }
                                );                                
                            }
                        }
                    );
                }
            }
        );
    })
    .catch( function (err) {
        deferred.reject(err);
    });
    

    return deferred.promise;
}

/**
 * Creates a reservation object.
 * @param {any} resrvParam
 */
function createRes(resrvParam) {
    var deferred = Q.defer();
    var user = {firstName: "Guest"};
    db.rmTypes.find(
        { name: resrvParam.roomType },
        function (err, rmTypes) {
            resrvParam.roomType = rmTypes[0]._id
        });
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
        });
        
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
                        subject: 'Welcome to the Martian Motel ' + resrvParam.Name,
                        text: 'Your reservation for ' + resrvParam.startDate + ' is booked!',
                        html: htmlstream
                    }, function(error, info) {
                        if (error) return console.log(error);
                        console.log('Message sent: ' + info.response);
                    });            
                    deferred.resolve(doc);
                });
            }        
            return deferred.promise;
        }

function _delete(_id) {
    var deferred = Q.defer();

    deleteFuture(_id)
    .then(function (doc) {
        if (doc["nRemoved"] === 0) {
            deletePresent(_id)
            .then(function (doc) {
                if (doc["nRemoved"] === 0 ) {
                    deletePast(_id)
                    .then(function (doc) {
                        deferred.resolve(doc);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })
                } else deferred.resolve(doc);
            })
            .catch(function (error) {
                deferred.reject(error);
            });
        } else deferred.resolve(doc);
    })
    .catch(function (error) {
        deferred.reject(error);
    });


    return deferred.promise;
}

/**
 * Check for availability here
 */
function isAvailable(resrvParam) {
    var deferred = Q.defer();
    
    if (resrvParam.roomType) {
        typeCount(resrvParam.roomType)
        .then(function () {
            deferred.resolve();
        })
        .catch(function (err) {
            deferred.reject(err);
        });
    } else {
        db.rmTypes.find(
            { space: {$gte: resrvParam.space} }, //Returns an array of room types that meet the space requirement
            function (err, rmTypes) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                var avail = false;
                for (var i = 0; i < rmTypes.length; i++) {
                    typeCount(rmTypes[i]._id)
                    .then(function () {
                        avail = true;
                        deferred.resolve();
                    });
                }
                //setTimeout(function() {
                //    
                //}, 5000);
            }
        );
    }

    function typeCount (rmType) {
        var deferred = Q.defer();
        db.rooms.count(
            { rmType: mongojs.ObjectID(rmType) },
            function (err, total) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                db.futureRes.count(
                    { $and: [
                        { startDate: { $lte: resrvParam.endDate } },
                        { endDate: { $gte: resrvParam.startDate } },
                        { roomType: mongojs.ObjectID(rmType) }
                    ]},
                    function (err, futureCount) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        if (futureCount >= total) {                
                            deferred.reject("No Availability");
                        } else {
                            db.presentRes.count(
                                { $and: [
                                    { startDate: { $lte: resrvParam.endDate } },
                                    { endDate: { $gte: resrvParam.startDate } },
                                    { roomType: mongojs.ObjectID(rmType) }
                                ]},
                                function (err, currentCount) {
                                    if (err) deferred.reject(err.name + ': ' + err.message)
                                    if ((futureCount + currentCount) >= total) {
                                        deferred.reject("No Availability");
                                    } else {
                                        deferred.resolve();
                                    }
                                }
                            );
                        }
                    }
                );              
            }
        );

        return deferred.promise;
    }

    return deferred.promise;
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

function getPastRes(){
    var deferred = Q.defer();

    db.pastRes.find(
        {},
        function(err, list){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(list);
        }
    );

    return deferred.promise;    
}

function getUserRes(_id) {
    var deferred = Q.defer();
    
    db.users.findOne(
        {_id: mongojs.ObjectID(_id)},
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (!user) deferred.reject("User not found");
            db.presentRes.find(
                {userEmail: user.email},
                function(err, pList) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    db.futureRes.find(
                        {userEmail: user.email},
                        function(err, fList) {
                            if (err) deferred.reject(err.name + ': ' + err.message);
                            deferred.resolve(pList.concat(fList));
                        }
                    );
                }
            );
        }
    );


    return deferred.promise;      
}

function getFutureRes(){
    var deferred = Q.defer();

    db.futureRes.find(
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
            deferred.resolve(doc);
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
            deferred.resolve(doc);
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
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function getResByID(_id) {
    var deferred = Q.defer();
    db.futureRes.findOne(
        { _id: mongojs.ObjectID(_id) },
        function (err, resrv) {
            if (resrv) deferred.resolve(resrv);
            else { //Not found in future database
                db.presentRes.findOne(
                    { _id: mongojs.ObjectID(_id) },
                    function (err, resrv) {
                        if (resrv) deferred.resolve(resrv);
                        else { //Not found in current database
                            db.pastRes.findOne(
                                { _id: mongojs.ObjectID(_id) },
                                function (err, resrv) {
                                    deferred.resolve(resrv);
                                }
                            ); 
                        }
                    }
                );
            }
        }
    );
    return deferred.promise;
}

function checkInOut(_id, date) {
    var deferred = Q.defer();

    getResByID(_id)
    .then(function (resrv) {
        if (!resrv.checkIn) {
            resrv.checkIn = date;
            deleteFuture(_id);
            db.presentRes.insert(resrv,
            function (err, doc) {
                deferred.resolve(doc);
            });
        }
        else if (!resrv.checkOut) {
            resrv.checkOut = date;
            deletePresent(_id);
            db.pastRes.insert(resrv,
            function (err, doc) {
                deferred.resolve(doc);
            });
        }
        else {
            deferred.reject("Customer already checked out");
        }
    })
    .catch(function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
}