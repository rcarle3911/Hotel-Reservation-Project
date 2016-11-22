var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongojs = require('mongojs');
var db = mongojs('hotel', ['users']);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://motelmartian%40gmail.com:CMSC495@UMUC@smtp.gmail.com');

var service = {};

service.create = create;

module.exports = service;

/**
 * Creates a user object. First checks if a user exists, then creates a user with the given parameters
 * @param {any} userParam - user object with email/password
 */
function create(userParam) {
    var deferred = Q.defer();

    //Checks if user exists
    db.users.findOne(
        { email: userParam.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.reject('The email "' + userParam.email + '" is already in use');
            } else {
                createUser();
            }
        });

    /**
     * Copies userParam without plaintext password. 
     * Hashes the password and stores it into the password field.
     * Inserts user into the database.
     * Sends user email upon success.
     */
    function createUser() {
        var user = _.omit(userParam, 'password');
        user.password = bcrypt.hashSync(userParam.password, 10);        
        user.permission = "customer";
        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                
                //Send email confirmation
                transporter.sendMail({
                    from: '"Martian Motel" <motelmartian@gmail.com>',
                    to: user.email,
                    subject: 'Welcome to the Martian Motel ' + user.firstName,
                    text: 'Your username is ' + user.email,
                    html: '<p>Your username is <b>' + user.email + '</b></p>'
                }, function(error, info) {
                    if (error) return console.log(error);
                    
                    console.log('Message sent: ' + info.response);
                });

                deferred.resolve();
            });
    }

    return deferred.promise;
}