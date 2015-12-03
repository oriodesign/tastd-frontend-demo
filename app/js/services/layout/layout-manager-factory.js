'use strict';

angular
    .module('services.layout')
    .factory('LayoutManager', function LayoutManagerFactory (
        LayoutConfig,
        $translate,
        $log
    ) {

        var LayoutManager = {
            configureLayout: configureLayout,
            configureEmptyLayout: configureEmptyLayout,
            setTitle: setTitle,
            getTitle: getTitle,
            setTranslatedTitle: setTranslatedTitle,
            title: ''
        };

        return LayoutManager;

        function setTitle (title) {
            LayoutManager.title = title;
        }

        function getTitle () {
            return LayoutManager.title;
        }

        function setTranslatedTitle (title) {
            LayoutManager.title = $translate.instant(title);
        }

        function configureEmptyLayout () {
            configureLayout(LayoutConfig.emptyLayoutConfig);
        }

        function extendConfig(config) {
            return _.extend({}, LayoutConfig.emptyLayoutConfig, config);
        }

        function configureLayout (config) {
            // Check header-bar is fully rendered
            if (document.getElementsByClassName('navbar-page-title').length === 0) {
                return setTimeout(function(){
                    configureLayout(config)
                }, 100);
            }

            config = extendConfig(config);
            var domElement;
            for(var element in config) {
                if (config[element] === 'inherit') {
                    continue;
                }
                domElement = angular.element(document.getElementsByClassName(element));
                config[element] ? domElement.addClass('active') : domElement.removeClass('active');
            }
        }

    });
