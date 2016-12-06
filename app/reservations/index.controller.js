(function () {
    'use strict';

    angular
        .module('app')
        .controller('Res.IndexController', Controller);

    function Controller($state, FlashService, $scope) {

        $scope.formInfo = {}
        $scope.saveData = function() {
                console.log($scope.formInfo);
        };

        $scope.submitForm = function(isValid) {
            // check to make sure the form is completely valid
            if (isValid) {
                alert('Our form is amazing');
            }
        };
  
    }

})();