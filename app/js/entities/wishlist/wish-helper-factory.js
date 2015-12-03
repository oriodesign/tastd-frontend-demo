'use strict';

angular
    .module('entities.wishlist')

    .factory('WishHelper', function WishHelperFactory(Wish) {
        var WishHelper = {
            getWishes: getWishes,
            getWishesFromStateParam: getWishesFromStateParam
        };

        return WishHelper;

        function getWishes(options) {
            return Wish.$search(options).$asPromise();
        }

        function getWishesFromStateParam($stateParams) {
            return WishHelper.getWishes({
                user : $stateParams.userId,
                geoname : $stateParams.cityId,
                cuisine : $stateParams.cuisineId
            });
        }

    });
