(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    /**
     * Pass in any objests or services that you'll use. For example, you could use UserService, RoomService, ReservationService, FlashService, or $window.
     * The services are defined in the app/app-services folder and loaded on the app/index.html page.
     * This controller is loaded in the app/index.html page as well and linked to the appropriate 
     */
    function Controller($window, ResService, UserService, FlashService, $http) {
        var vm = this;
        
        vm.user = null;
        vm.rmtypes = [];
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.deleteRes = deleteRes;
        vm.getRoomType = getRoomType;
        

        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                
            });
            ResService.GetAll().then(function(reservations) {
                vm.reservations = reservations;
            });
            $http.get('/api/protected/room/type')
                .then(function (res) {
                    vm.rmtypes = res.data;
                })
                .catch(function (res) {
                    console.log("Failed to pull room types");
                });              
        }

        function getRoomType(room) {
            if (!vm.rmtypes) {
                return;
            }
            for (var c = 0; c < vm.rmtypes.length; c++) { 
                var rt = vm.rmtypes[c];
                if (rt._id == room.roomType) {
                    return rt.name;
                }
            }
        };

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    /**
                     * @todo Log user out when directed to /login
                     */
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteRes(_id) {
            ResService.Delete(_id)
            .then(function() {
                FlashService.Success('Reservation Cancelled');
                $window.location.reload();
            })
            .catch(function (error) {
                    FlashService.Error(error);
            });
        }
    }

})();