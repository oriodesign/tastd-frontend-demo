'use strict';

angular
    .module('services.geocode')
    .constant('HttpGeocodeConfig', {
        transformResponse : function (response) {
            if(response.data) {
                if(response.data.addresses) {
                    return response.data.addresses;
                }
                if(angular.isDefined(response.data.address)) {
                    return response.data.address;
                }
            }
            return response;
        }
    });
