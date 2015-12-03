'use strict';

angular
    .module('entities.invite')
    .factory('Invite', function InviteFactory(restmod) {
        return restmod.model('/invites').mix({
            $$type: 'Invite',
            $config: {
                name: 'invite',
                plural: 'invites'
            }
        });
    });
