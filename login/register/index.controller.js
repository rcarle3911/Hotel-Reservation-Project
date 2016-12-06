(function () {
    'use strict';

    angular
        .module('login')
        .controller('Registration.IndexController', Controller);

    function Controller(LoginService, FlashService) {
        var vm = this; 

        vm.user = null;
        vm.saveUser = register;

        initController();

        function initController() {

        }

        function register() {
            LoginService.Create(vm.user)
            .then(function () {
                FlashService.Success('Registration Successful');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }
            
    }

})();