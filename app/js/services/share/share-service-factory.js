'use strict';

angular
    .module('services.share')
    .factory('ShareService', function ShareServiceFactory(
        $cordovaSocialSharing
    ) {
        var
            title,
            message,
            link;

        return {
            share: share,
            config: config
        };

        function config (config) {
            title = config.title;
            message = config.message;
            link = config.link;
        }

        function share () {
            if (!window.cordova) {
                return window.alert('Missing cordova.');
            }

            return $cordovaSocialSharing.share(message, title, null, link);
        }
    });
