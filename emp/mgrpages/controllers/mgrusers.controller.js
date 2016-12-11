//User Accounts Page get all users / Clear filter (on mgrusers.html)
angular.module('app').controller('userCtrl', ['$scope', '$http','$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderByField = 'lastname';
    $scope.reverseSort = false;

    $scope.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $http.get('/api/protected/users').then(function (res) {
        $scope.users = res.data;
    });

    $scope.clearFilter = function () {
        console.log("Cleared Filter");
        $scope.txtFilter = null;

    };
    // MODAL WINDOW
    $scope.open = function (_user) {
        var modalInstance = $modal.open({
          controller: "ModalInstanceCtrl",
          templateUrl: '/emp/mgrpages/mgrusers.modal.html',
            resolve: {
                user: function() {
                    return _user;
                }
            }
        });
    };
    
}]);

app.controller('ModalInstanceCtrl', function ($scope, user, $modalInstance)
{
    $scope.user = user;

    $scope.cancel = function () {
        console.log("Cancel clicked");
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        console.log("ok clikced"); 
        $modalInstance.close(); 
    }; 
});

