'use strict';

angular
    .module('directives.notification')
    .directive('notification', function NotificationDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                pushMessage: '=pushMessage'
            },
            templateUrl: 'js/directives/notification/notification.html'
        };
    });
