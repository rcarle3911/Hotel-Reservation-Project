//User Accounts Page get all Rooms / Clear filter (on mgrrooms.html)
angular.module('emp').controller('roomTypeCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderRoomTypeByField = 'num';
    $scope.reverseRoomTypeSort = false;

    $scope.roomTypes = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    loadData();

    function loadData() {
        $http.get('/api/protected/room/type').then(function (res) {
            $scope.roomTypes = res.data;
        });
    };

    $scope.clearRoomTypeFilter = function () {
        $scope.txtRoomTypeFilter = null;
    };

    $scope.deleteRoomType = function (_room) {
        console.log(_room);
        $http.delete('/api/protected/room/type/' + _room._id, {_id: _room._id}).then(
                function () {
                    // success callback
                    $scope.roomTypes = [];
                    loadData();
                },
                function () {
                    // failure callback
                    console.log("Failed to Delete");
                }
            );
    };

    // MODAL WINDOW
    $scope.openType = function (_room) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceRoomTypeCtrl",
            templateUrl: '/emp/mgrpages/mgrroomtypes.modal.html',
            resolve: {
                roomType: function () {
                    return _room;
                }
            }
        });
        modalInstance.result.then(function () {
            loadData();
        });
    };
}]);


//mgrrooms.modal.html
app.controller('ModalInstanceRoomTypeCtrl', function ($scope, roomType, $modalInstance, $http) {
    $scope.min = 1;
    $scope.max = 7;

    if (roomType == "new") {
        console.clear();
        $scope.newReq = true;
        //fake room
        roomType = {
            name: "",
            desc: "",
            space: 1
        };
    }

    $scope.roomType = roomType;
    console.log(roomType);
    //orginal values
    $scope.origRoomType = angular.copy($scope.roomType);

    $scope.cancelRoomType = function () {
        //reset data to defaults
        if (!$scope.newReq) {
            angular.copy($scope.origRoomType, $scope.roomType);
        }
        $modalInstance.dismiss('cancel');
    };



    $scope.okRoomType = function (request, response) {
        console.log(roomType);
        if (!$scope.newReq) {
            $http.put('/api/protected/room/' + roomType._id, roomType)
                .then(
                    function (response) {
                        // success callback
                        console.log("Put Sucessful");
                        console.log(JSON.stringify(response));
                    },
                    function (response) {
                        // failure callback
                        console.log("Failed to Put");
                        console.log(JSON.stringify(response));
                    }
                );
        } else {
            $http.post('/api/protected/room/', roomType).then(
                function (response) {
                    // success callback
                    console.log("Put Sucessful");
                    console.log(JSON.stringify(response));
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Put");
                    console.log(JSON.stringify(response));
                }
            );
        }
        $modalInstance.close();
    };
});

angular.module('emp').filter('range', function () {
    return function (input, min, max) {
        min = parseInt(min, 10);
        max = parseInt(max, 10);
        for (var i = min; i < max; i++)
            input.push(i);
        return input;
    };
}); 