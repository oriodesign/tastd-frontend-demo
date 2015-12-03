'use strict';

angular
    .module('entities.device')
    .factory('DeviceManager', function DeviceManagerFactory(
        Device,
        EntityManager
    ) {
        return _.extend(new EntityManager(Device), {
            findAllByUserId: findAllByUserId,
            createIOSDevice: createIOSDevice
        });

        function findAllByUserId(userId) {
            return Device.$search({ user: userId }).$asPromise();
        }

        function createIOSDevice(deviceToken, userId) {
            return Device.$create({
                token: deviceToken,
                user: userId,
                name: 'ios'
            });
        }

    });

