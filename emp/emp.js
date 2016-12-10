
//Controller Stuff
var app = angular.module('app', ['ultimateDataTableServices','ui.bootstrap','reservations' ]);

app.controller('EmpCtrl', ['$timeout', function ($timeout) {

var view = this; 
view.tabShown = false; 


view.tabs = [
    { title:'Reservations', content : 'create', icon: 'glyphicon glyphicon-calendar', usesres : 'visible'},
    { title:'Check In',  content : 'checkin', icon: 'glyphicon glyphicon-log-in', usesres : 'visible'},
    { title:'Check-Out', content : 'checkout', icon: 'glyphicon glyphicon-log-out', usesres : 'visible'}, 
    { title:'Management', contenturl:'/emp/mgrpages/manager.html', icon: 'glyphicon glyphicon-wrench', usesres : 'hidden'}
  ];
    
    view.tabSelect = function(){
      $timeout(function() {
        view.tabShown = true;
      });
    };

    
  }
]);

app.controller('TabsDemoCtrl', function ($scope) {
  
});

app.controller('mgrCtrl', ['$timeout', function ($timeout) {

var view = this; 
view.tabShown = false; 

view.tabs = [
    { title:'User Accounts', contenturl:'/emp/mgrpages/mgrusers.html', icon: 'glyphicon glyphicon-user' },
    { title:'Room Management', contenturl:'/emp/mgrpages/mgrrooms.html', icon: 'glyphicon glyphicon-bed'},
    { title:'Occupancy Report', contenturl:'/emp/mgrpages/mgroccrpt.html', icon: 'glyphicon glyphicon-list-alt'}, 
    { title:'Housekeeping Report', contenturl:'/emp/mgrpages/mgrmaidrpt.html', icon: 'glyphicon glyphicon-file'}
  ];
    
  }
]);

app.controller('userCtrl', function ($scope) {
    $scope.orderByField = 'last_name'; 
    $scope.reverseSort = false;

    $scope.users = [{
        "id": 2,
        "first_name": "Melissa",
        "last_name": "Ferguson",
        "email": "mferguson0@wsj.com",
        "phone": "380-(566)816-7526",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 3,
        "first_name": "Douglas",
        "last_name": "Hernandez",
        "email": "dhernandez1@creativecommons.org",
        "phone": "355-(136)532-6316",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 4,
        "first_name": "Marilyn",
        "last_name": "Diaz",
        "email": "mdiaz2@ustream.tv",
        "phone": "387-(798)863-8674",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 5,
        "first_name": "Lawrence",
        "last_name": "Peters",
        "email": "lpeters3@howstuffworks.com",
        "phone": "66-(528)907-0462",
        "Role": "Manager",
        "Status": true
    }, {
        "id": 6,
        "first_name": "Joe",
        "last_name": "Meyer",
        "email": "jmeyer4@bbb.org",
        "phone": "63-(275)815-7111",
        "Role": "Employee",
        "Status": false
    }, {
        "id": 7,
        "first_name": "Jack",
        "last_name": "Wood",
        "email": "jwood5@nature.com",
        "phone": "48-(181)821-3729",
        "Role": "Employee",
        "Status": true
    }, {
        "id": 8,
        "first_name": "Andrew",
        "last_name": "Burns",
        "email": "aburns6@gizmodo.com",
        "phone": "81-(825)658-2452",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 9,
        "first_name": "Jean",
        "last_name": "Dunn",
        "email": "jdunn7@virginia.edu",
        "phone": "66-(572)681-6517",
        "Role": "Employee",
        "Status": false
    }, {
        "id": 10,
        "first_name": "Edward",
        "last_name": "Watson",
        "email": "ewatson8@mtv.com",
        "phone": "389-(388)266-0609",
        "Role": "Employee",
        "Status": false
    }, {
        "id": 11,
        "first_name": "Victor",
        "last_name": "Elliott",
        "email": "velliott9@wisc.edu",
        "phone": "46-(154)160-8234",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 12,
        "first_name": "Heather",
        "last_name": "Fox",
        "email": "hfoxa@last.fm",
        "phone": "58-(621)731-9932",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 13,
        "first_name": "Teresa",
        "last_name": "Tucker",
        "email": "ttuckerb@google.com.br",
        "phone": "63-(977)328-8482",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 14,
        "first_name": "George",
        "last_name": "Gonzales",
        "email": "ggonzalesc@yahoo.com",
        "phone": "967-(920)584-9640",
        "Role": "Employee",
        "Status": false
    }, {
        "id": 15,
        "first_name": "Frank",
        "last_name": "Palmer",
        "email": "fpalmerd@mysql.com",
        "phone": "54-(156)934-4291",
        "Role": "Manager",
        "Status": false
    }, {
        "id": 16,
        "first_name": "Sharon",
        "last_name": "Bailey",
        "email": "sbaileye@dmoz.org",
        "phone": "60-(766)214-6859",
        "Role": "Customer",
        "Status": true
    }, {
        "id": 17,
        "first_name": "Johnny",
        "last_name": "Rivera",
        "email": "jriveraf@phoca.cz",
        "phone": "86-(667)907-4156",
        "Role": "Manager",
        "Status": true
    }, {
        "id": 18,
        "first_name": "Sarah",
        "last_name": "Mccoy",
        "email": "smccoyg@imageshack.us",
        "phone": "86-(852)225-3924",
        "Role": "Manager",
        "Status": false
    }, {
        "id": 19,
        "first_name": "Nancy",
        "last_name": "Lynch",
        "email": "nlynchh@discovery.com",
        "phone": "62-(348)669-2586",
        "Role": "Manager",
        "Status": true
    }, {
        "id": 20,
        "first_name": "Lillian",
        "last_name": "Armstrong",
        "email": "larmstrongi@java.com",
        "phone": "86-(439)375-0057",
        "Role": "Manager",
        "Status": false
    }, {
        "id": 21,
        "first_name": "Brenda",
        "last_name": "Wright",
        "email": "bwrightj@imageshack.us",
        "phone": "7-(131)350-7250",
        "Role": "Manager",
        "Status": false
    }];
    $scope.clearFilter = function() {
      console.log("xxx");
      $scope.txtFilter = null; 
      
    };
});

$(function () {
    $.get('/emp/token', function (token) {
        if (token) window.jwtToken = token;
    });
});