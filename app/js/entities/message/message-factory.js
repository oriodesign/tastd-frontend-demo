'use strict';

angular
    .module('entities.message')
    .factory('Message', function MessageFactory(restmod) {
        return restmod.model('/messages').mix({
            $$type : 'Message'
        });
    });
