'use strict';

angular
    .module('entities.pushMessage')
    .factory('PushMessage', function PushMessageFactory(restmod, RestBase) {
        var PushMessage = restmod
            .model('/push-messages')
            .mix(RestBase, {
                $$type : 'PushMessage',
                $config: {
                    name: 'pushMessage',
                    plural: 'pushMessages'
                }
            });
        return PushMessage;
    });
