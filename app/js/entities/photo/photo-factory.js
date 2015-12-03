'use strict';

angular
    .module('entities.photo')
    .factory('Photo', function PhotoFactory(restmod) {
        return restmod.model('/photos').mix({
            $$type: 'Photo',
            $config: {
                name: 'photo',
                plural: 'photos'
            }
        });
    });
