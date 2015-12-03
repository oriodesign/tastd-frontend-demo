'use strict';
angular
    .module('services.http')
    .config(function($httpProvider, PARAMETERS) {
        var interceptor = function() {
            return {
                request: function(config) {
                    config.timeout = PARAMETERS.HTTP_TIMEOUT;
                    return config;
                }
            };
        };

        $httpProvider.interceptors.push(interceptor);
    });
