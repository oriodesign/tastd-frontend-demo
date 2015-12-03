'use strict';

angular
    .module('states.notification', [])
    .config(function ($stateProvider) {

        $stateProvider.state('notifications', {
            url : '/notifications',
            cache: false,
            parent : 'private',
            templateUrl : 'js/states/notification/notification.html',
            controller : 'NotificationCtrl as ctrl',
            title: 'notification.page_title',
            layout: {
                'main-menu-news': true,
                'navbar-back-button': true
            }
        });
    });
