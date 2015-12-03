'use strict';

angular
    .module('services.http')

    .provider('HttpApiFactory', function HttpApiFactoryProvider() {

        var provider = this,
            providerConfig = {
                baseUrl : ''
            };

        provider.config = function (options) {
            if(angular.isObject(options)) {
                providerConfig = angular.extend({}, providerConfig, options);
                return this;
            }else{
                return providerConfig;
            }
        };

        function appendTransform(defaults, transform) {
            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        this.$get = function ($q, $http) {

            function httpConfiguration(httpApi, method, url, config, data, canceler) {

                var configuration = angular.extend({}, {
                    method: method,
                    url: httpApi.config.baseUrl + url,
                    transformResponse: appendTransform($http.defaults.transformResponse, function (response) {
                        if(httpApi.config.httpTransformResponse) {
                            return httpApi.config.httpTransformResponse(response, configuration);
                        }
                        return response;
                    })
                }, config || {});

                if(data) { configuration.data = data; }

                if(canceler && !configuration.timeout) {
                    configuration.timeout = canceler.promise;
                }

                return configuration;
            }

            function successCallback(httpApi, configuration) {
                var promise = function (response) {
                    if(httpApi.config.transformResponse) {
                        return httpApi.config.transformResponse(response, configuration);
                    }
                    return response;
                };

                return promise;
            }

            function createShortMethods(httpApi, httpMethods) {
                angular.forEach(httpMethods, function(httpMethod) {
                    httpApi[httpMethod] = httpApi['$' + httpMethod] = function(url, config) {
                        var canceler = $q.defer();
                        var configuration = httpConfiguration(httpApi, httpMethod, url, config, null, canceler);
                        var promise = $http(configuration);
                        return promise.then(successCallback(httpApi, configuration));
                    };
                });
            }

            function createShortMethodsWithData(httpApi, httpMethods) {
                angular.forEach(httpMethods, function(httpMethod) {
                    httpApi[httpMethod] = httpApi['$' + httpMethod] = function(url, data, config) {
                        var canceler = $q.defer();
                        var configuration = httpConfiguration(httpApi, httpMethod, url, config, data, canceler);
                        var promise = $http(configuration);
                        return promise.then(successCallback(httpApi, configuration));
                    };
                });
            }


            function httpApiFactory(config) {

                var httpApi = {
                    config : angular.extend({}, provider.config(), config || {})
                };

                createShortMethods(httpApi,['get', 'delete', 'head', 'jsonp']);
                createShortMethodsWithData(httpApi, ['post', 'put']);

                return httpApi;
            }

            return httpApiFactory;
        };



        return provider;
    });
