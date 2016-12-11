//User Accounts Page get all users / Clear filter (on mgrusers.html)
angular.module('app').controller('userCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
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
    console.log(user); 

    $scope.cancel = function () {
        console.log("Cancel clicked");
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        $http.delete('/api/protected/users/' + user._id, {_id: user._id})
        .then(
            function (response) {
                // success callback
                console.log("Delete Sucessful");
            },
            function (response) {
                // failure callback
               console.log("Failed to Delete");

            }
        ); 
        $modalInstance.close();
    };

    $scope.ok = function () {
            $http.put('/api/protected/users/' + user._id, user)
            .then(
                function (response) {
                    // success callback
                    console.log("Put Sucessful");
                    console.log(respone);
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Put");
                    console.log(respone);
                }
            );
        console.log("ok clikced");
        $modalInstance.close();
    };
});