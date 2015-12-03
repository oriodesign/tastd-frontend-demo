'use strict';

angular
    .module('entities.device')
    .factory('Device', function DeviceFactory(restmod, RestBase) {
        var Device = restmod
            .model('/devices')
            .mix(RestBase, {
                $$type : 'Device'
            });

        return Device;
    });
