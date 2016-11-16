(function () {
    'use strict';

    angular
        .module('app')
        .factory('ContactService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;        
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/contacts').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/contacts/' + _id).then(handleSuccess, handleError);
        }

        function Create(contact) {
            return $http.post('/api/contacts', contact).then(handleSuccess, handleError);
        }

        function Update(contact) {
            return $http.put('/api/contacts/' + contact._id, contact).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/contacts/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            console.log("Service responds: ");
            console.log(res.data);
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
