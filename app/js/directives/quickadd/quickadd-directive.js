'use strict';

angular
    .module('directives.quickadd')
    .directive('quickadd', function GalleryDirective(
        MyWishedHelper,
        MyReviewedHelper,
        ConfirmPopup,
        EventDispatcher,
        Analytics
    ) {
        var QUICKADD_TPL_URL = 'js/directives/quickadd/quickadd.html';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: QUICKADD_TPL_URL,
            controllerAs: 'ctrl',
            controller: quickAddDirectiveController,
            scope: {
                restaurant : '=',
                extendedVersion : '=',
                page: '@'
            }
        };

        function quickAddDirectiveController ($scope) {
            var ctrl = this;
            ctrl.restaurantId = $scope.restaurant.restaurantId || $scope.restaurant.id;
            ctrl.toggleWish = toggleWish;
            ctrl.toggleReview = toggleReview;
            ctrl.isWishActive = isWishActive;
            ctrl.isReviewActive = isReviewActive;
            ctrl.quickAddDone = function () {
                $scope.$emit('quickadd.done');
            };


            function toggleWish (restaurantId) {
                isWishActive(restaurantId) ? deleteWish(restaurantId) : createWish(restaurantId);
            }

            function toggleReview (restaurantId) {
                isReviewActive(restaurantId) ? deleteReview(restaurantId) : createReview(restaurantId);
            }

            function deleteWish (restaurantId) {
                MyWishedHelper.remove(restaurantId)
                    .then(function(review){
                        Analytics.trackEvent('wish', 'delete', $scope.page);
                        EventDispatcher.broadcast('wish.delete', review);
                    });
            }

            function createWish (restaurantId) {
                MyWishedHelper.add(restaurantId)
                    .then(function(wish){
                        Analytics.trackEvent('wish', 'create', $scope.page);
                        EventDispatcher.broadcast('wish.create', wish);
                    });
            }

            function createReview (restaurantId) {
                MyReviewedHelper.add(restaurantId)
                    .then(function(review){
                        Analytics.trackEvent('review', 'create', $scope.page);
                        EventDispatcher.broadcast('review.create', review);
                    });
                MyWishedHelper.removeLocal(restaurantId);
            }

            function deleteReview (restaurantId) {
                ConfirmPopup.create('popup.restaurant_delete.title','popup.restaurant_delete.text')
                    .then(function (answer) {
                        answer && MyReviewedHelper.remove(restaurantId)
                            .then(function(review){
                                Analytics.trackEvent('review', 'delete', $scope.page);
                                EventDispatcher.broadcast('review.delete', review);
                            });
                    });
            }

            function isWishActive (restaurantId) {
                return MyWishedHelper.get(restaurantId);
            }

            function isReviewActive (restaurantId) {
                return MyReviewedHelper.get(restaurantId);
            }

        }

    });
