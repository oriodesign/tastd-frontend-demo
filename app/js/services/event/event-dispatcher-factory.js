'use strict';

angular
    .module('services.event')
    .factory('EventDispatcher', function EventDispatcherFactory($rootScope, TastdEvent) {

        var EventDispatcher = {
            broadcast: broadcast,
            event: TastdEvent
        };

        function broadcast () {
            $rootScope.$broadcast.apply($rootScope, arguments);
        }

        return EventDispatcher;
    });
