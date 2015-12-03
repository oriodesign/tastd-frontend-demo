'use strict';

angular
    .module('entities.photo')
    .factory('PhotoManager', function PhotoManagerFactory (
        Photo,
        EntityManager
    ) {
        return _.extend(new EntityManager(Photo), {});
    });
