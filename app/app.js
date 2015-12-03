'use strict';

// Tastd App
angular
    .module(AppHelper.APP_NAME, [
        // app wide third-party modules
        'ngCordova',
        'ionic',
        'ui.gravatar',
        'ui.validate',
        'rzModule',
        'angularMoment',
        'services.storage',
        'angular.filter',
        'pascalprecht.translate',
        'ngIOS9UIWebViewPatch',

        // app wide shared modules
        'appHelper',

        // Directives
        'directives.cuisine',
        'directives.flashMessage',
        'directives.focus',
        'directives.history',
        'directives.loader',
        'directives.map',
        'directives.notification',
        'directives.photo',
        'directives.quickadd',
        'directives.restaurant',
        'directives.review',
        'directives.security',
        'directives.tag',
        'directives.user',
        'directives.wall',

        // Entities
        'entities.address',
        'entities.cuisine',
        'entities.device',
        'entities.expertise',
        'entities.flag',
        'entities.friend',
        'entities.follower',
        'entities.geoname',
        'entities.invite',
        'entities.leader',
        'entities.message',
        'entities.option',
        'entities.place',
        'entities.photo',
        'entities.pushMessage',
        'entities.restaurant',
        'entities.restmod',
        'entities.review',
        'entities.tag',
        'entities.user',
        'entities.wishlist',

        // Filters
        'filters',

        // Modals
        'modals.address',
        'modals.autocomplete',
        'modals.geoname',
        'modals.cuisine',
        'modals.filters',
        'modals.fields',
        'modals.review',
        'modals.geoGuru',
        'modals.tag',
        'modals.user',

        // Popups
        'popups',

        // Services
        'services.cache',
        'services.contacts',
        'services.event',
        'services.facebook',
        'services.flag',
        'services.flashMessage',
        'services.geocode',
        'services.google',
        'services.http',
        'services.layout',
        'services.log',
        'services.map',
        'services.notification',
        'services.photo',
        'services.price',
        'services.prototype',
        'services.ranking',
        'services.review',
        'services.security',
        'services.storage',
        'services.translations',
        'services.utility',
        'services.validator',

        // grunt-html2js generated module : TEMPLATES_MODULE = services.templates
        // @if !DEBUG
        // @echo TEMPLATES_MODULE
        // @endif

        // app wide states modules
        'states.public',
        'states.private'
    ])
    /**
     * app wide run block
     */
    .run(function (
        $ionicPlatform,
        $state,
        AppHelper
    ) {
        $ionicPlatform.ready(function () {
            if (typeof window.analytics !== 'undefined') {
                window.analytics.startTrackerWithId('UA-58670667-2');
            }

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (!AppHelper.isWebApp() && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

        });
    });

