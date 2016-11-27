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
    group = Object.freeze({
		CUSTOMER: 0,
		EMPLOYEE: 1,
		MANAGER: 2
	}),

service.create = create;
service.edit = edit;
service.editByEmail = editByEmail;
service.delete = _delete;
service.authenticate = authenticate;
service.getUsers = getUsers;
service.getById = getById;

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
     * Copies userParam without plaintext password and creates customer user by default. 
     * Hashes the password and stores it into the password field.
     * Inserts user into the database.
     * Sends user email upon success.
     */
    function createUser() {
        var user = _.omit(userParam, 'password');
        user.password = bcrypt.hashSync(userParam.password, 10);        
        user.group = group.CUSTOMER;
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

function edit(_id, userParam) {
    var deferred = Q.defer();

    db.users.findOne(
        {_id: mongojs.ObjectID(_id)},
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (user.email !== userParam.email) {
                // To ensure unique emails, check if email already exists
                db.users.findOne(
                    { email: userParam.email },
                    function (err, user) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        if (user) deferred.reject('The email ' + userParam.email + ' is alread in use.');
                        else editUser();
                    }
                );
            }
        }
    );

    function editUser() {
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            dob: userParam.dob,
            phone: userParam.phone,
            email: userParam.email,
            address: userParam.address,
        };

        if (userParam.password) {
            set.password = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongojs.ObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            }
        );
    }

    return deferred.promise;
}

function editByEmail(email, userParam) {
    var deferred = Q.defer();

    db.users.findOne(
        { email: email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (user) {
                edit(user._id, userParam)
                .then(function(doc) {
                    deferred.resolve(doc);
                })
                .catch(function(err) {
                    deferred.reject(err);
                });
            }
        }
    );
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongojs.ObjectID(_id) },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(doc);
        }
    );

    return deferred.promise;
}

function authenticate(email, password) {
    var deferred = Q.defer();

    db.users.findOne(
        { email: email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user && bcrypt.compareSync(password, user.password)) {
                deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
            } else {
                deferred.reject("Authentication Failed");
            }
        }
    );

    return deferred.promise;
}

function getUsers() {
    var deferred = Q.defer();

    db.users.find(
        {}, // Returns all users
        {password: 0}, // Excludes password field for security
        function(err, users) {
            if (err) deferred.reject(err.name + ': ' + err.message); 
            deferred.resolve(users);
        }
    );

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findOne(
        { _id: mongojs.ObjectID(_id) },
        { password: 0 }, // Excludes password field
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(user);
        }
    );

    return deferred.promise;
}