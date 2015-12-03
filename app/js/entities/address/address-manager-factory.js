'use strict';

angular
    .module('entities.address')
    .factory('AddressManager', function AddressManagerFactory (
        Address,
        EntityManager
    ) {
        return new EntityManager(Address);
    });
