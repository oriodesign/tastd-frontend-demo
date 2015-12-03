'use strict';

angular
    .module('services.cache')
    .factory('MyCache', function MyCacheFactory($q) {

        var map = {};

        return {

            get : function(key, resolver){
                if(map[key]){
                    var defer = $q.defer();
                    defer.resolve(map[key]);
                    return defer.promise;
                } else {
                    return resolver().then(function(value){
                        map[key] = value;
                        return value;
                    });
                }
            },

            set : function(key, value){
                map[key] = value;
            },

            invalidate : function(key){
                delete map[key];
            }

        };

    });

