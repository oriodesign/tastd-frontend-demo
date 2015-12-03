'use strict';

angular
    .module('services.utility')
    .provider('DebugJson', function DebugJsonProvider() {
        var provider = this,
            options  = {
                debug : true
            };

        provider.options = function (opt) {
            options = angular.extend({}, options, opt);
        };

        provider.$get = function () {
            return {
                options : options
            };
        };

        return provider;
    });
