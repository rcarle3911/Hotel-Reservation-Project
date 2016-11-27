var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['pastRes', 'presentRes', 'futureRes', 'users', 'rooms', 'rmTypes']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');
var today = new Date();

var service = {};

service.create = create;
service.isAvailable = isAvailable;

module.exports = service;

/**
 * Creates a reservation object.
 * @param {any} resrvParam
 */
function create(resrvParam) {
    var deferred = Q.defer();
    var user = {firstName: "Guest"};

    db.users.findOne(
        { email: resrvParam.userEmail },
        function (err, userFound) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            else {
                if (userFound) user = userFound;
                isAvailable(resrvParam, function(err, avail, m){
                    if (err) {
                        return console.log(err.message);
                    } else if (avail===false) {
                        console.log("No availability for selected dates"); //} //deferred.reject("No availability for selected dates");
                    } else {
                        db.futureRes.insert(
                            resrvParam,
                            function (err, doc) {
                                if (err) deferred.reject(err.name + ': ' + err.message);
                                //Send email confirmation
                                var htmlstream = fs.createReadStream('../services/resConfEmail.html');
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
                            });
                    }
                    });
            }});
}
/**
 * Check for availability here
 */
function isAvailable(resrvParam, callback) {
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
}
/**
 * Count by Room Types
 */
function rmTypeCount(resrvParam, callback) {
    db.rmTypes.find({name: resrvParam.rmType}).count(function(err, totCount){
        if(err) return callback(err);
        callback(null, totCount);
    });
}