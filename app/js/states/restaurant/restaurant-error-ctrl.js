'use strict';

angular.module('states.restaurant')

    .controller('NoticeErrorCtrl', function (
        $scope,
        $state,
        MessageHelper,
        restaurant,
        Loader
    ) {
        var self = this;

        $scope.error = {};

        $scope.sendError = function () {
            return Loader
                .track(MessageHelper.sendRestaurantError(restaurant.id, $scope.error.content))
                .then(function (response) {

                    $state.go('restaurantView', {
                        restaurantId : restaurant.id
                    });
                    return response;
                });

        };
    });
