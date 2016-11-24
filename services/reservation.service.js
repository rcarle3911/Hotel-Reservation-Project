var Q = require('q');
var fs = require('fs')
var mongojs = require('mongojs');
var db = mongojs('hotel', ['pastRes', 'presentRes', 'futureRes', 'users', 'rooms']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');

var service = {};

service.create = create;
service.isAvailable = isAvailable;

module.exports = service;

/**
 * Creates a reservation object. Does not defer.
 * @param {any} resrvParam
 */
function create(resrvParam) {
    var user = {firstName: "Guest"};

    db.users.findOne(
        { email: resrvParam.userEmail },
        function (err, userFound) {
            if (err) return console.log(err.name + ': ' + err.message);
            if (userFound) user = userFound;
            if (!isAvailable(resrvParam)) return console.log("No availability for selected dates");
            else {
                db.futureRes.insert(
                    resrvParam,
                    function (err, doc) {
                        if (err) return console.log(err.name + ': ' + err.message);
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
                        console.log(doc);
                });
            }
        });

}
/**
 * @todo Check for availability here
 */
function isAvailable(resrvParam) {
    
    return true;
}