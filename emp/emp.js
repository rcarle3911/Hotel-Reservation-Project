$(function () {
    $.get('/emp/token', function (token) {
        if (token) window.jwtToken = token;
    });
});

//Controller Stuff
var app = angular.module('app', ['ultimateDataTableServices', 'ui.bootstrap', 'reservations']);

app.controller('EmpCtrl', function ($scope) {

    $scope.tabs = [{
        title: 'Reservations',
        contenturl: '/emp/pages/reservations.html',
        icon: 'glyphicon glyphicon-calendar',
        usesres: 'visible'
    }, {
        title: 'Check In',
        contenturl: '/emp/pages/checkin.html',
        icon: 'glyphicon glyphicon-log-in',
        usesres: 'visible'
    }, {
        title: 'Check-Out',
        contenturl: '/emp/pages/checkout.html',
        icon: 'glyphicon glyphicon-log-out',
        usesres: 'visible'
    }, {
        title: 'Management',
        contenturl: '/emp/mgrpages/manager.html',
        icon: 'glyphicon glyphicon-wrench',
        usesres: 'hidden'
    }];
});

app.controller('mgrCtrl', function ($scope) {
    $scope.tabs = [{
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

});

app.controller('userCtrl', function ($scope, $http, $window) {
    var vm = this;
    vm.orderByField = 'lastname';
    vm.reverseSort = false;

    vm.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $http.get('/api/protected/users').then(function (res) {
        console.log(res.data);
        vm.users = angular.toJSON(res.data); 
        //vm.users = res.data;
    });

    vm.clearFilter = function () {
        console.log("Cleared Filter");
        vm.txtFilter = null;

    };
});