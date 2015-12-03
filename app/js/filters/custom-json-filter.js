'use strict';

angular
    .module('filters')
    .filter('customJsonFilter', function (JsonUtil) {
        return function (obj) {
            return JsonUtil.toJson(obj);
        };
    });
