'use strict';

angular
    .module('popups')
    .factory('DuplicatedRestaurantPopup', function DuplicatedRestaurantPopupFactory (
        $translate,
        $rootScope,
        $ionicPopup,
        $state
    ) {

        return {
            create: create
        };

        function create (restaurants) {
            var popupScope = $rootScope.$new();
            popupScope.duplicatedRestaurants = restaurants;
            popupScope.chooseRestaurant = function (id) {
                popupPromise.close();
                $state.go('restaurantView', {
                    restaurantId : id
                });
            };
            var popupPromise = $ionicPopup.show({
                title : $translate.instant('restaurant.duplicated_title'),
                scope: popupScope,
                templateUrl : 'js/popups/duplicated-restaurant-popup.html',
                buttons: [
                    {
                        text: $translate.instant('restaurant.duplicated_continue'),
                        type: 'button-positive',
                        onTap: function (e) {
                            return 'continue';
                        }

                    },
                    {
                        text: $translate.instant('button.cancel'),
                        type: 'button-default',
                        onTap: function (e) {
                            return 'cancel';
                        }

                    }
                ]
            });

            return popupPromise;
        }

    });
