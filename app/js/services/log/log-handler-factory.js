'use strict';

angular
    .module('services.log')
    .factory('LogHandler', function($log) {
        return function() {
            $log.error.apply($log, arguments);
        };
    });
