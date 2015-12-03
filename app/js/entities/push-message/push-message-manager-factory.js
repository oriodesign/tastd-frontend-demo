'use strict';

angular
    .module('entities.pushMessage')
    .factory('PushMessageManager', function PushMessageManagerFactory(
        PushMessage,
        $http,
        Config,
        EntityManager
    ) {

        var PushMessageManager = _.extend(new EntityManager(PushMessage), {
            findAllByUserId: findAllByUserId,
            markAllAsSeen: markAllAsSeen,
            getUnseenCounter: getUnseenCounter
        });

        return PushMessageManager;

        function findAllByUserId(userId) {
            return PushMessage.$search({ user: userId }).$asPromise();
        }

        function markAllAsSeen(userId) {
            var payload = {
                user: userId
            };
            return $http.post(Config.apiUrl()+'/push-messages/seen', payload);
        }

        function getUnseenCounter (userId) {
            var parameters = {
                user: userId
            };
            return $http.get(Config.apiUrl()+'/push-messages/counter', {params: parameters});
        }

    });

