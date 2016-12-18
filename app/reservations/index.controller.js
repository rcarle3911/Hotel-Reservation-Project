(function () {
    'use strict';

    angular
        .module('app')
        .controller('Res.IndexController', Controller);

    function Controller($window, ResService, UserService, FlashService, $http) {
        var vm = this;

        vm.rmtypes = [];
        vm.formInfo = {}
        vm.submitForm = submitForm;
        
        initController();

        function initController() {
            /*
             * Will populate reservation Name and Email with currently logged in user
             */
            if ($window.jwtToken) {
                UserService.GetCurrent()
                .then(function (user) {
                    vm.formInfo.firstname = user.firstname;
                    vm.formInfo.lastname = user.lastname;
                    vm.formInfo.userEmail = user.email;
                })
                .catch(function (err) {
                    console.log(err);
                });
            }
            
            //Populate Room Type dropdown; map Type Names to IDs
            $http.get('/api/public/room/type')
            .then(function (res) {
                vm.rmtypes = res.data;
            })
            .catch(function (res) {
                console.log("Failed to pull room types");
            });
        }
        
        function submitForm() {
            ResService.Create(vm.formInfo)
                .then(function () {
                    FlashService.Success('Reservation Completed');
                })
                .catch(function (err) {
                    FlashService.Error(err);
                });
            }
        }
    
})();