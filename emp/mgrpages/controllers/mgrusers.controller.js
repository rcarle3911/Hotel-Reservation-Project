//User Accounts Page get all users / Clear filter (on mgrusers.html)
angular.module('app').controller('userCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderByField = 'lastname';
    $scope.reverseSort = false;

    $scope.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    loadUserData(); 

    function loadUserData() {
        $http.get('/api/protected/users').then(function (res) {
            $scope.users = res.data;
        });

    }

    $scope.delete = function (_user) {
        $http.delete('/api/protected/users/' + _user._id, {
                _id: _user._id
            })
            .then(
                function () {
                    // success callback
                    $scope.users = []; 
                    loadUserData(); 
                },
                function () {
                    // failure callback
                    console.log("falied to delete");
                }
            );
    };

    $scope.clearFilter = function () {
        $scope.txtFilter = null;
    };
    // MODAL WINDOW
    $scope.open = function (_user) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: '/emp/mgrpages/mgrusers.modal.html',
            resolve: {
                user: function () {
                    return _user;
                }
            }
        });
    };
}]);

//Mgrusers.modal.html
app.controller('ModalInstanceCtrl', function ($scope, user, $modalInstance, $http) {
    $scope.user = user;

    $scope.origUser = angular.copy($scope.user);  

    $scope.cancel = function () {
        angular.copy($scope.origUser, $scope.user); 
        $modalInstance.dismiss('cancel');
    };
    
    $scope.ok = function (request, response) {
        $http.put('/api/protected/users/' + user._id, user)
            .then(
                function (response) {
                    // success callback
                },
                function (response) {
                    // failure callback
                    console.log(JSON.stringify(response));
                }
            );
        $modalInstance.close();
    };
});