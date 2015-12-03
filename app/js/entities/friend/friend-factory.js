'use strict';

angular
    .module('entities.friend')
    .factory('Friend', function FriendFactory(restmod) {
        var Friend = restmod.model('/friends').mix({
            $$type: 'Friend'
        });

        return Friend;
    });

