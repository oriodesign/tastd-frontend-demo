'use strict';

angular
    .module('services.geocode')
    .factory('HttpGeocodeApi', function HttpGeocodeApiFactory(
        HttpApiFactory,
        Config,
        HttpGeocodeConfig,
        AddressManager
    ) {
        var HttpGeocodeApi = new HttpApiFactory(angular.extend({}, {
                baseUrl : Config.apiUrl('/geocode')
            }, HttpGeocodeConfig
        ));

        HttpGeocodeApi.searchAddress = function (q) {

            var params = {
                query : q,
                precision : 'STREET_NAME'
            };

            return AddressManager.findAll(params).then(function (addresses) {
                return addresses;
            });
        };

        HttpGeocodeApi.searchCityAddress = function (q) {

            var params = {
                query : q,
                precision : 'CITY'
            };

            return AddressManager.findAll(params).then(function (addresses) {
                return addresses;
            });
        };

        return HttpGeocodeApi;
    });
