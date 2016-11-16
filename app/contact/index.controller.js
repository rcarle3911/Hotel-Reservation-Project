(function () {
    'use strict';

    angular
        .module('app')
        .controller('Contact.IndexController', Controller);

    function Controller($window, ContactService, FlashService) {
        console.log("Hello World from controller");

        var vm = this;

        vm.addContact = addContact;
        vm.removeContact = removeContact;
        vm.editContact = editContact;
        vm.updateContact = updateContact;
        vm.deselectContact = deselectContact;

        refresh();

        function refresh () {
            ContactService.GetAll().then(function (response) {
                console.log("Controller got the data requested");
                console.log(response);
                vm.contactlist = response;
                vm.contact = "";
            });
        }

        function addContact () {
            console.log("Controller Adds: ");
            console.log(vm.contact);
            ContactService.Create(vm.contact).then(function (response) {
                refresh();
            });
        }

        function removeContact (_id) {
            console.log("Controller Deletes: " + _id);
            ContactService.Delete(_id).then(function (response) {
                refresh();
            });
        }

       function editContact (_id) {
            console.log("Controller Edits: " + _id);
            ContactService.GetById(_id).then(function (response) {
                vm.contact = response;
            });
        }

        function updateContact () {
            console.log("Controller Updates: " + vm.contact._id);
            ContactService.Update(vm.contact).then(function (response) {
                refresh();
            });
        }

        function deselectContact () {
            vm.contact = "";
        }
    }

})();