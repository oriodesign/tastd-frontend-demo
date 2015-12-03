'use strict';

angular
    .module('services.utility')
    .factory('Platform', function PlatformFactory($window) {
        var Platform = {
            isIOS: isIOS,
            isAndroid: isAndroid,
            getDebugString: getDebugString
        };

        return Platform;

        function isIOS () {
            return $window.ionic.Platform.isIOS() && $window.ionic.Platform.isWebView();
        }

        function isAndroid () {
            return $window.ionic.Platform.isAndroid() && $window.ionic.Platform.isWebView();
        }

        function getDebugString () {
            var properties = {
                isWebView: $window.ionic.Platform.isWebView(),
                isIOS: $window.ionic.Platform.isIOS(),
                iosAndroid: $window.ionic.Platform.isAndroid(),
                isIPad: $window.ionic.Platform.isIPad(),
                platform: $window.ionic.Platform.platform(),
                version: $window.ionic.Platform.version()
            };

            return JSON.stringify(properties);
        }
    });

