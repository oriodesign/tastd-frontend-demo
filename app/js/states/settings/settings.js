'use strict';

angular
    .module('states.settings', [
        'entities.message',
        'services.security',
        'entities.user'
    ])

    .config(function ($stateProvider) {

        $stateProvider.state('settings', {
            url : '/settings',
            parent : 'private',
            templateUrl : 'js/states/settings/settings.html',
            layout: {
                'main-menu-profile': true,
                'navbar-back-button': true
            },
            controller : 'SettingsCtrl as ctrl',
            title: 'settings.page_title'
        });

        $stateProvider.state('settings.account', {
            url : '/settings/account',
            parent : 'private',
            templateUrl : 'js/states/settings/account.html',
            controller : 'AccountCtrl as ctrl',
            title: 'settings.edit_account.page_title',
            layout: {
                'navbar-back-button': true,
                'navbar-done-button': true,
                'main-menu-profile': true
            }
        });

        $stateProvider.state('settings.notifications', {
            url : '/settings/notifications',
            parent : 'private',
            templateUrl : 'js/states/settings/notifications.html',
            controller : 'NotificationsCtrl as ctrl',
            title: 'settings.notification.page_title',
            layout: {
                'navbar-back-button': true,
                'main-menu-profile': true
            },
            resolve : {
                notifications : function (OptionManager) {
                    return OptionManager.get('notifications');
                }
            }
        });

        $stateProvider.state('settings.language', {
            url : '/settings/language',
            parent : 'private',
            templateUrl : 'js/states/settings/language.html',
            controller : 'LanguageCtrl as ctrl',
            layout: {
                'navbar-back-button': true,
                'main-menu-profile': true
            },
            title: 'settings.language.page_title',
            resolve : {
                language : function (OptionManager) {
                    return OptionManager.get('language');
                }
            }
        });

        $stateProvider.state('settings.password', {
            url : '/settings/password',
            parent : 'private',
            layout: {
                'navbar-back-button': true,
                'main-menu-profile': true,
                'navbar-done-button': true
            },
            templateUrl : 'js/states/settings/password.html',
            controller : 'PasswordCtrl as ctrl',
            title: 'settings.password.page_title'
        });

        $stateProvider.state('settings.feedback', {
            url : '/settings/feedback',
            parent : 'private',
            templateUrl : 'js/states/settings/feedback.html',
            layout: {
                'navbar-back-button': true,
                'main-menu-profile': true
            },
            controller : 'FeedbackCtrl',
            title: 'settings.feedback.page_title'
        });

        $stateProvider.state('settings.log', {
            url : '/settings/log',
            parent : 'private',
            templateUrl : 'js/states/settings/log.html',
            layout: {
                'navbar-back-button': true,
                'main-menu-profile': true
            },
            controller : 'LogCtrl as ctrl',
            title: 'Log'
        });


    });
