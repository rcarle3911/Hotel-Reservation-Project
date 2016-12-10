$(function () {
    $.get('/emp/token', function (token) {
        if (token) window.jwtToken = token;
    });
});

//Controller Stuff
var app = angular.module('app', ['ultimateDataTableServices', 'ui.bootstrap', 'reservations']);

app.controller('EmpCtrl', ['$timeout', function ($timeout) {

    var view = this;
    view.tabShown = false;


    view.tabs = [{
        title: 'Reservations',
        content: 'create',
        icon: 'glyphicon glyphicon-calendar',
        usesres: 'visible'
    }, {
        title: 'Check In',
        content: 'checkin',
        icon: 'glyphicon glyphicon-log-in',
        usesres: 'visible'
    }, {
        title: 'Check-Out',
        content: 'checkout',
        icon: 'glyphicon glyphicon-log-out',
        usesres: 'visible'
    }, {
        title: 'Management',
        contenturl: '/emp/mgrpages/manager.html',
        icon: 'glyphicon glyphicon-wrench',
        usesres: 'hidden'
    }];

    view.tabSelect = function () {
        $timeout(function () {
            view.tabShown = true;
        });
    };


}]);

app.controller('TabsDemoCtrl', function ($scope) {

});

app.controller('mgrCtrl', ['$timeout', function ($timeout) {

    var view = this;
    view.tabShown = false;

    view.tabs = [{
        title: 'User Accounts',
        contenturl: '/emp/mgrpages/mgrusers.html',
        icon: 'glyphicon glyphicon-user'
    }, {
        title: 'Room Management',
        contenturl: '/emp/mgrpages/mgrrooms.html',
        icon: 'glyphicon glyphicon-bed'
    }, {
        title: 'Occupancy Report',
        contenturl: '/emp/mgrpages/mgroccrpt.html',
        icon: 'glyphicon glyphicon-list-alt'
    }, {
        title: 'Housekeeping Report',
        contenturl: '/emp/mgrpages/mgrmaidrpt.html',
        icon: 'glyphicon glyphicon-file'
    }];

}]);

app.controller('userCtrl', function ($scope, $http, $window) {
    var vm = this;
    vm.orderByField = 'lastname';
    vm.reverseSort = false;

    vm.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $http.get('/api/protected/users').then(function (res) {
        console.log(res.data);
        vm.users = res.data; 
    });

    vm.clearFilter = function () {
        console.log("Cleared Filter");
        vm.txtFilter = null;

    };
});

//saved 
//{
//     "id": 2,
//     "firstname": "Melissa",
//     "lastname": "Ferguson",
//     "email": "mferguson0@wsj.com",
//     "phone": "380-(566)816-7526",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 3,
//     "firstname": "Douglas",
//     "lastname": "Hernandez",
//     "email": "dhernandez1@creativecommons.org",
//     "phone": "355-(136)532-6316",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 4,
//     "firstname": "Marilyn",
//     "lastname": "Diaz",
//     "email": "mdiaz2@ustream.tv",
//     "phone": "387-(798)863-8674",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 5,
//     "firstname": "Lawrence",
//     "lastname": "Peters",
//     "email": "lpeters3@howstuffworks.com",
//     "phone": "66-(528)907-0462",
//     "group": "Manager",
//     "Status": true
// }, {
//     "id": 6,
//     "firstname": "Joe",
//     "lastname": "Meyer",
//     "email": "jmeyer4@bbb.org",
//     "phone": "63-(275)815-7111",
//     "group": "Employee",
//     "Status": false
// }, {
//     "id": 7,
//     "firstname": "Jack",
//     "lastname": "Wood",
//     "email": "jwood5@nature.com",
//     "phone": "48-(181)821-3729",
//     "group": "Employee",
//     "Status": true
// }, {
//     "id": 8,
//     "firstname": "Andrew",
//     "lastname": "Burns",
//     "email": "aburns6@gizmodo.com",
//     "phone": "81-(825)658-2452",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 9,
//     "firstname": "Jean",
//     "lastname": "Dunn",
//     "email": "jdunn7@virginia.edu",
//     "phone": "66-(572)681-6517",
//     "group": "Employee",
//     "Status": false
// }, {
//     "id": 10,
//     "firstname": "Edward",
//     "lastname": "Watson",
//     "email": "ewatson8@mtv.com",
//     "phone": "389-(388)266-0609",
//     "group": "Employee",
//     "Status": false
// }, {
//     "id": 11,
//     "firstname": "Victor",
//     "lastname": "Elliott",
//     "email": "velliott9@wisc.edu",
//     "phone": "46-(154)160-8234",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 12,
//     "firstname": "Heather",
//     "lastname": "Fox",
//     "email": "hfoxa@last.fm",
//     "phone": "58-(621)731-9932",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 13,
//     "firstname": "Teresa",
//     "lastname": "Tucker",
//     "email": "ttuckerb@google.com.br",
//     "phone": "63-(977)328-8482",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 14,
//     "firstname": "George",
//     "lastname": "Gonzales",
//     "email": "ggonzalesc@yahoo.com",
//     "phone": "967-(920)584-9640",
//     "group": "Employee",
//     "Status": false
// }, {
//     "id": 15,
//     "firstname": "Frank",
//     "lastname": "Palmer",
//     "email": "fpalmerd@mysql.com",
//     "phone": "54-(156)934-4291",
//     "group": "Manager",
//     "Status": false
// }, {
//     "id": 16,
//     "firstname": "Sharon",
//     "lastname": "Bailey",
//     "email": "sbaileye@dmoz.org",
//     "phone": "60-(766)214-6859",
//     "group": "Customer",
//     "Status": true
// }, {
//     "id": 17,
//     "firstname": "Johnny",
//     "lastname": "Rivera",
//     "email": "jriveraf@phoca.cz",
//     "phone": "86-(667)907-4156",
//     "group": "Manager",
//     "Status": true
// }, {
//     "id": 18,
//     "firstname": "Sarah",
//     "lastname": "Mccoy",
//     "email": "smccoyg@imageshack.us",
//     "phone": "86-(852)225-3924",
//     "group": "Manager",
//     "Status": false
// }, {
//     "id": 19,
//     "firstname": "Nancy",
//     "lastname": "Lynch",
//     "email": "nlynchh@discovery.com",
//     "phone": "62-(348)669-2586",
//     "group": "Manager",
//     "Status": true
// }, {
//     "id": 20,
//     "firstname": "Lillian",
//     "lastname": "Armstrong",
//     "email": "larmstrongi@java.com",
//     "phone": "86-(439)375-0057",
//     "group": "Manager",
//     "Status": false
// }, {
//     "id": 21,
//     "firstname": "Brenda",
//     "lastname": "Wright",
//     "email": "bwrightj@imageshack.us",
//     "phone": "7-(131)350-7250",
//     "group": "Manager",
//     "Status": false
// }