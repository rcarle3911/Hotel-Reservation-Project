//User Accounts Page get all Rooms / Clear filter (on mgrrooms.html)
angular.module('app').controller('roomCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderRoomByField = 'num';
    $scope.reverseRoomSort = false;

    $scope.rooms = [];
    $scope.rmtypes = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    $http.get('/api/protected/room').then(function (res) {
        $scope.rooms = res.data;
        console.log("API room pull:");
        console.log($scope.rooms);
    });

    // //not working yet
    $http.get('/api/protected/room/type')
        .then(
            function (res) {
                $scope.rmtypes = res.data;
                console.log(JSON.stringify(res.data));
                console.log("API room Type pull:");
                console.log($scope.rmtypes);
            },
            function (res) {
                // failure callback
                console.log("Failed to pull room types");
                console.log(JSON.stringify(res));
            }
        );

    $scope.getRoomType = function (room) {
        console.log(room);
        if (!$scope.rmtypes) {
            return;
        }
        for (var c = 0; c < $scope.rmtypes.length; c++) {
            var rt = $scope.rmtypes[c];
            if (rt._id == room.rmType) {
                console.log(rt.name);
                return rt.name;
            }
        }
    };

    $scope.clearRoomFilter = function () {
        $scope.txtRoomFilter = null;
    };

    $scope.deleteRoom = function (_room) {
        console.log(_room);
        $http.delete('/api/protected/room/' + _room._id, {
                _id: _room._id
            })
            .then(
                function () {
                    // success callback
                },
                function () {
                    // failure callback
                    console.log("Failed to Delete");
                    console.log(JSON.stringify(response));
                }
            );
    };

    // MODAL WINDOW
    $scope.open = function (_room) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceRoomCtrl",
            templateUrl: '/emp/mgrpages/mgrrooms.modal.html',
            resolve: {
                room: function () {
                    return _room;
                }
            }
        });
    };
}]);


//mgrrooms.modal.html
app.controller('ModalInstanceRoomCtrl', function ($scope, room, $modalInstance, $http) {
    $scope.room = room;
    $scope.rmtypes = [];

    $scope.cancelRoom = function () {
        $modalInstance.dismiss('cancel');
    };

    //Load Room types 
    //not working yet
    $http.get('/api/protected/room/type')
        .then(
            function (res) {
                $scope.rmtypes = res.data;
                console.log(JSON.stringify(res.data));
                console.log("API room Type pull:");
                console.log($scope.rmtypes);
            },
            function (res) {
                // failure callback
                console.log("Failed to pull room types");
                console.log(JSON.stringify(res));

            }
        );

    $scope.okRoom = function (request, response) {
        $http.put('/api/protected/room/' + room._id, room)
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
        $modalInstance.close();
    };
    $scope.avail = function (request, response) {
        console.log(room._id);
        $http.patch('/api/protected/room/' + room._id, {
                _id: room._id
            })
            .then(
                function (response) {
                    // success callback
                    console.log("Toggle Availbility Sucessful");
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Delete");
                    console.log(JSON.stringify(response));
                }
            );
    };
});