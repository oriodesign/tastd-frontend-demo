'use strict';

angular
    .module('services.http')
    .config(function($httpProvider) {
        var interceptor = function($q, $timeout, $injector) {
            return {
                responseError: function(response) {
                    if (response.status === 0 && !response.config.noIntercept) {
                        var $http = $injector.get('$http');
                        var DisconnectedPopup = $injector.get('DisconnectedPopup');

                        return DisconnectedPopup.create().then(function(res) {
                            if(res){
                                return $http(response.config);
                            }
                            else{
                                return $q.reject(response);
                            }
                        });
                    }
                    return $q.reject(response);
                }
            };
        };

        $httpProvider.interceptors.push(interceptor);
    });
