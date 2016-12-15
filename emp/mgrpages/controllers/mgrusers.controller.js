//User Accounts Page get all users / Clear filter (on mgrusers.html)
angular.module('emp').controller('userCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderByUserField = 'lastname';
    $scope.reverseUserSort = false;

    $scope.users = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    loadUserData(); 

    function loadUserData() {
        $http.get('/api/protected/users').then(function (res) {
            $scope.users = res.data;
        });

    }

    $scope.deleteUser = function (_user) {
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

    $scope.getUserGroup = function (_user) {
        if(_user.group == 1)
        {
            return "Employee";
        }
        else if(_user.group == 2)
        {
            return "Manager";
        }
        else 
        {
            return "Customer";
        }
    }

    $scope.clearUserFilter = function () {
        $scope.txtUserFilter = null;
    };
    // MODAL WINDOW
    $scope.openUser = function (_user) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: '/emp/mgrpages/mgrusers.modal.html',
            resolve: {
                user: function () {
                    return _user;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.users = []; 
            loadUserData();
        });
    };
}]);

//Mgrusers.modal.html
app.controller('ModalInstanceCtrl', function ($scope, user, $modalInstance, $http) {
    if(user == "new")
    {
        $scope.newUser = true;
        //temp user
        user = {
            firstname: "", 
            lastname: "",
            dob: "",
            phone: "",
            email: "",
            address: "", 
            password: "password", 
            group: 0
        }

    }
    
    
    $scope.user = user;
    console.clear();
    console.log(user);

    $scope.origUser = angular.copy($scope.user);  

    $scope.cancelUser = function () {
        if (!$scope.newUser) {
        angular.copy($scope.origUser, $scope.user); 
        }
        $modalInstance.dismiss('cancel');
    };
    
    $scope.okUser = function (request, response) {
        if(!$scope.newUser)
        {
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
        } else {
            $http.post('/api/public/users/register/', user).then(
                function (response) {
                    // success callback
                    console.log("Post Sucessful");
                    console.log(JSON.stringify(response));
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Post");
                    console.log(JSON.stringify(response));
                }
            );
        }
        $modalInstance.close();
    };
});