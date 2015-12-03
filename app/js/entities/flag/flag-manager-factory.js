'use strict';

angular
    .module('entities.flag')
    .factory('FlagManager', function FlagManagerFactory(
        Flag,
        EntityManager
    ) {

        return _.extend(new EntityManager(Flag), {

        });

    });
