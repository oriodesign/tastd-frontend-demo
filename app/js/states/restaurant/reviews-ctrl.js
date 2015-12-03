'use strict';

angular
    .module('states.restaurant')
    .controller('ReviewsCtrl', function (
        ReviewManager,
        me,
        $scope,
        $state,
        $stateParams
    ) {
        var ctrl = this;
        ctrl.$state = $state;
        ctrl.loading = true;
        ctrl.myFollowingReviews = [];
        ctrl.loadMore = loadMore;
        initialize();

        function initialize () {
            ReviewManager.findAll({
                leadersOf:me.id,
                restaurant: $stateParams.restaurantId,
                serializationGroups: 'reviewOwner'
            }).then(function(reviews){
                ctrl.restaurant = reviews[0].restaurant;
                ctrl.myFollowingReviews = reviews;
                ctrl.loading = false;
            });
        }

        function loadMore () {
            ctrl.myFollowingReviews.$fetchMore().$then(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

    });
