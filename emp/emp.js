function getToken() {
    $.ajax({
        async: false,
        type: 'GET',
        url: '/app/token',
        success: function (token) {
            if (token) {
                window.jwtToken = token;
            } else {
                window.location.href = '/login';
            }
        }
    });
};

//Controller Stuff
var app = angular
    .module('emp', ['ultimateDataTableServices', 'ui.bootstrap', 'chart.js', 'reservations'])
    .run(function ($window, $http) {
        getToken();
        if ($window.jwtToken) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        }
    });

//Employee pages tabs (on /emp/index.html)
app.controller('EmpCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {



    $http.get('/api/protected/users/current').then(function (res) {
        $scope.cUser = res.data;
        var user = $scope.cUser;
        if (user.group == 0) {
            //kick them out.
            return $window.location.href = '/app';
        }

        $scope.tabs = [{
            title: 'Reservations',
            contenturl: '/emp/pages/reservations.html',
            icon: 'glyphicon glyphicon-calendar',
            usesres: 'visible',
            disable: !(user.group > 0)
        }, {
            title: 'Check In',
            contenturl: '/emp/pages/checkin.html',
            icon: 'glyphicon glyphicon-log-in',
            usesres: 'visible',
            disable: !(user.group > 0)
        }, {
            title: 'Check-Out',
            contenturl: '/emp/pages/checkout.html',
            icon: 'glyphicon glyphicon-log-out',
            usesres: 'visible',
            disable: !(user.group > 0)
        }, {
            title: 'Management',
            contenturl: '/emp/mgrpages/manager.html',
            icon: 'glyphicon glyphicon-wrench',
            usesres: 'hidden',
            disable: !(user.group > 1)
        }];
        
        $scope.logout = function () {
            $window.jwtToken = null;
            $window.isLoggedIn = false;
            $window.location.href = '/login';
        }
    }, function (res) {
        //faliure
        console.log(res.data);
    });
}]);