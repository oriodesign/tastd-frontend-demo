'use strict';

angular
    .module('entities.restaurant')
    .factory('Restaurant', function RestaurantFactory(
        restmod,
        Geoname,
        $http,
        Base64Util
    ) {

        var Restaurant = restmod.model('/restaurants').mix({
            $$type : 'Restaurant',
            reviews   : {
                hasMany : 'Review'
            }
        });

        return Restaurant;
    });
