'use strict';

angular
    .module('filters')
    .filter('cleanUrl', function() {
        return function(url) {
            return url.replace(/^https?:\/\//, '')
                      .replace(/\/$/, '');
        };
    });
