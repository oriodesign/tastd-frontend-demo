'use strict';

angular
    .module('services.http')
    .factory('HttpAuthApi', function HttpAuthApiFactory(HttpApiFactory, Config) {
        return new HttpApiFactory({
            baseUrl : Config.authUrl()
        });
    });
