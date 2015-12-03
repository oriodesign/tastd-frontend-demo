'use strict';

angular
    .module('services.layout')
    .factory('LayoutConfig', function LayoutConfigFactory (){
        var emptyLayoutConfig = {
            'navbar-back-button': false,
            'navbar-share-button': false,
            'navbar-done-button': false,
            'navbar-edit-button': false,
            'navbar-notification-button': false,
            'navbar-settings-button': false,
            'navbar-ranking-title': false,
            'main-menu': true,
            'main-menu-news': false,
            'main-menu-restaurants': false,
            'main-menu-add': false,
            'main-menu-gurus': false,
            'main-menu-profile': false,
            'navbar-geo-guru': false,
            'navbar-page-title': true,
            'navbar-map-button': false
        };

        var LayoutConfig = {
            emptyLayoutConfig: emptyLayoutConfig
        };

        return LayoutConfig;
    });
