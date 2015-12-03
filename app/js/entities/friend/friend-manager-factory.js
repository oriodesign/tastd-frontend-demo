'use strict';

angular
    .module('entities.friend')
    .factory('FriendManager', function UserManagerFactory (
        Friend,
        EntityManager
    ) {
        return _.extend(new EntityManager(Friend), {});
    });
