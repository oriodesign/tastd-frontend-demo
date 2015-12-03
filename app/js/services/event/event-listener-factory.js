'use strict';

angular
    .module('services.event')
    .factory('EventListener', function EventListenerFactory($rootScope, TastdEvent) {

        var EventListener = {
            on: on,
            event: TastdEvent
        };

        function on () {
            $rootScope.$on.apply($rootScope, arguments);
        }

        return EventListener;
    });
