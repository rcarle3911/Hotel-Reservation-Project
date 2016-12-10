//User Accounts Page get all users / Clear filter (on mgrusers.html)
angular.module('app').controller('userCtrl', ['$scope', '$http','$window', function ($scope, $http, $window) {
    $scope.orderByField = 'lastname';
    $scope.reverseSort = false;

    $scope.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $http.get('/api/protected/users').then(function (res) {
        $scope.users = JSON.parse(JSON.stringify(res.data));
    });

    $scope.clearFilter = function () {
        console.log("Cleared Filter");
        $scope.txtFilter = null;

    };
}]);

