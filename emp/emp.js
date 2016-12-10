$(function () {
    $.get('/emp/token', function (token) {
        if (token) 
        {
            window.jwtToken = token;
        }
        else
        {
            window.location.href = '/login';
        }
    });
});

//Controller Stuff
var app = angular.module('app', ['ultimateDataTableServices', 'ui.bootstrap', 'reservations']);

//Employee pages tabs (on /emp/index.html)
app.controller('EmpCtrl', ['$scope', function ($scope) {

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
}]);
