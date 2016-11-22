var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['reservations', 'users']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');

var service = {};

service.create = create;
service.isAvailable = isAvailable;

module.exports = service;

/**
 * Creates a reservation object
 * @param {any} resrvParam
 */
function create(resrvParam) {
    var deferred = Q.defer();
    var user = {firstName: "Guest"};
    
    db.users.findOne(
        { email: resrvParam.userEmail },
        function (err, userFound) {
            if (userFound) user = userFound;
            if (!isAvailable(resrvParam)) deferred.reject("No availability for selected dates");
            else {
                db.reservations.insert(
                    resrvParam,
                    function (err, doc) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        console.log(user);
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
                    deferred.resolve();
                });
            }
        });
    

    return deferred.promise;
}
/**
 * @todo Check for availability here
 */
function isAvailable(resrvParam) {
    return true;
}