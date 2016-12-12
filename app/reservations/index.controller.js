(function () {
    'use strict';

    angular
        .module('app')
        .controller('Res.IndexController', Controller);

    function Controller($state, ResService, FlashService, $scope) {
        var vm = this;
        vm.formInfo = {}
        vm.submitForm = submitForm;
        
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