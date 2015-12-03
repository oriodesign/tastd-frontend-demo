'use strict';

angular
    .module('directives.restaurant')
    .directive('restaurant', function RestaurantDirective() {

        return {
            restrict : 'E',
            templateUrl : 'js/directives/restaurant/restaurant.html',
            controllerAs : 'ctrl',
            controller : function (
                $scope,
                Loader,
                $state,
                MyWishedHelper,
                MyReviewedHelper
            ) {
                var ctrl = this;

                $scope.$on('quickadd.done', function(){
                    $scope.showQuickadd = false;
                });

                // item can be a restaurant or a review: everything will work the same in this directive,
                // but the restaurant id that can be item.restaurantId (review) or item.id (restaurant)
                $scope.restaurantId = $scope.item.restaurantId || $scope.item.id;
                $scope.restaurant = $scope.item.restaurant || $scope.item;

                ctrl.onClick = function () {
                    if (!$scope.preventSelect) {
                        $scope.onClick() || $state.go('restaurantView', {
                                restaurantId : $scope.restaurantId
                            });
                    }
                };

                ctrl.toggleQuickadd = function ($event) {
                    $scope.showQuickadd = !$scope.showQuickadd;
                    $event.stopPropagation();
                };

                ctrl.getIconClass = function () {
                    return MyWishedHelper.get($scope.restaurantId) ? 'icon-bookmark'
                            : (MyReviewedHelper.get($scope.restaurantId)? 'icon-heart' : 'icon-plus');
                };

                ctrl.getBackgroundImageString = function () {
                    if ($scope.showFallbackPicture) {
                        return 'img/default_restaurant.png';
                    }
                    if ($scope.item.thumb) {
                        return $scope.item.thumb;
                    }
                    return $scope.item.picture;
                }

            },
            scope : {
                item : '=',
                showAddress : '=',
                hideQuickadd : '=',
                showFallbackPicture : '=',
                preventSelect : '=',
                fromWeb: '@',
                onClick : '&',
                distance : '=',
                page: '@'
            }
        };
    });

