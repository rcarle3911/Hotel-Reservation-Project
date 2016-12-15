$(function () {
    $.get('/emp/token', function (token) {
        if (token) {
            window.jwtToken = token;
            console.log(window.jwtToken);
        } else {
            window.location.href = '/login';
        }
    });
});

//Controller Stuff
var app = angular.module('emp', ['ultimateDataTableServices', 'ui.bootstrap', 'reservations']);



//Employee pages tabs (on /emp/index.html)
app.controller('EmpCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    // if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    // $http.get('/api/protected/users/current').then(function (res) {
    //     $scope.cUser = res.data;
    //     console.log("success");
    //     console.log($scope.cUser);
    // }, function (res) {
    //     //faliure
    //     console.log("error");
    //     console.log(res.data);
    // });

    $scope.tabs = [{
        title: 'Reservations',
        contenturl: '/emp/pages/reservations.html',
        icon: 'glyphicon glyphicon-calendar',
        usesres: 'visible',
        disable: false
    }, {
        title: 'Check In',
        contenturl: '/emp/pages/checkin.html',
        icon: 'glyphicon glyphicon-log-in',
        usesres: 'visible',
        disable: false
    }, {
        title: 'Check-Out',
        contenturl: '/emp/pages/checkout.html',
        icon: 'glyphicon glyphicon-log-out',
        usesres: 'visible',
        disable: false
    }, {
        title: 'Management',
        contenturl: '/emp/mgrpages/manager.html',
        icon: 'glyphicon glyphicon-wrench',
        usesres: 'hidden',
        disable: false
    }];
}]);