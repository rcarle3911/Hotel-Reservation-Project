var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['pastRes', 'presentRes', 'futureRes', 'users', 'rooms']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');
var config = require('config.json');
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
            if (userFound) user = userFound;
            if (!isAvailable(resrvParam)) deferred.reject("No availability for selected dates");
            else {
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
                });
            }
        });

}
/**
 * @todo Use config.json to get total room numbers.
 */
function isAvailable(resrvParam) {
    
    return true;
}