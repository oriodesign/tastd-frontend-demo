'use strict';

angular
    .module('states.onBoarding')
    .controller('OnBoardingTopRestaurantsCtrl', function (
        me,
        $q,
        Review,
        $scope,
        $state,
        RestaurantManager,
        LayoutManager,
        $log,
        $translate
    ) {

        var ctrl = this;
        ctrl.me = me;
        ctrl.restaurants = [];
        ctrl.loading = true;
        ctrl.searchCriteria = {
            name: ''
        };
        ctrl.search = _.debounce(searchRestaurants, 300);
        ctrl.loadMore = loadMore;
        ctrl.done = done;
        ctrl.placeholder = $translate.instant('on_boarding.top_restaurants.input_placeholder')
            + ' ' + me.geoname.asciiName;

        initialize();


        function initialize () {
            searchRestaurants();
        }

        function searchRestaurants () {
            $log.debug('[CONTROLLER] Search restaurants', ctrl.searchCriteria.name);
            ctrl.loading = true;
            ctrl.restaurants.length = 0;
            if (ctrl.searchCriteria.name.trim() === '') {
                searchTopRestaurants();
            } else {
                searchRestaurantsByName();
            }
        }

        function searchTopRestaurants () {
            RestaurantManager.findTopRestaurants(me.geoname.id)
                .then(function (restaurants) {
                    ctrl.loading = false;
                    ctrl.restaurants = restaurants;
                });
        }

        function searchRestaurantsByName () {
            $log.debug('[CONTROLLER] Search by name');
            var restaurantSearch = RestaurantManager.findByName(ctrl.searchCriteria.name, me.geoname.id);
            restaurantSearch.then(function(restaurants) {
                ctrl.loading = false;
                ctrl.restaurants = restaurants;
            });
        }

        function loadMore () {
            return ctrl.restaurants.$fetchMore().$asPromise()
                       .finally(function() {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                       });
        }

        function done () {
            $state.go('onBoardingFriends');
        }
    });
