(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.Update = Update;
        service.GetCurrent = GetCurrent;
        service.Delete = Delete;

        return service;

        function Update(user) {
            //console.log(user)
            return $http.put('/api/protected/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function GetCurrent() {
            return $http.get('/api/protected/users/current').then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/protected/users/' + _id).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
