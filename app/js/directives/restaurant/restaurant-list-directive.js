'use strict';

angular
    .module('directives.restaurant')
    .directive('restaurantList', function RestaurantListDirective() {

        return {
            restrict : 'E',
            templateUrl : 'js/directives/restaurant/restaurant-list.html',
            controllerAs : 'ctrl',
            scope : {
                list: '=',
                page: '@',
                showAddress: '=',
                hideQuickadd: '=',
                showFallbackPicture: '=',
                preventSelect: '=',
                reorder: '=',
                geoname: '='
            }
        };
    });

