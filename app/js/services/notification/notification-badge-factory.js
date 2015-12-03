'use strict';

angular
    .module('services.notification')
    .factory('NotificationBadge', function NotificationBadgeFactory() {
        return {
            counter: 0
        };

    });
