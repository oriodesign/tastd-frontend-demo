'use strict';

angular
    .module('services.storage')
    .factory('SimpleLocalStorage', function SimpleLocalStorageFactory(
        $window,
        $log,
        JsonUtil
    ) {
        return {
            'set': function(key, value) {
                $window.localStorage[key] = value;
                return this;
            },
            'get': function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $log.debug('[STORAGE] set storage key "%s"', key, value);
                $window.localStorage[key] = JsonUtil.toJson(value);
                return this;
            },
            getObject: function(key, defaultObj) {
                return angular.fromJson($window.localStorage[key] || null) || defaultObj;
            },
            clear : function (key) {
                delete $window.localStorage[key];
                return this;
            }
        };
    });
