(function () {
    'use strict';

    angular
        .module('login')
        .controller('ForgotPass.IndexController', Controller);

    function Controller(LoginService, FlashService) {
        var vm = this; 

        vm.user = null;
        vm.forgotPass = forgotPass;

        initController();

        function initController() {

        }

        function forgotPass() {
            LoginService.Create(vm.user)
            .then(function () {
                FlashService.Success('Message Sent!');
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }
            
    }

})();