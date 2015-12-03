'use strict';


angular
    .module('states.restaurant')
    .controller('RestaurantSearchCtrl', function (
        $scope,
        $ionicModal,
        $state,
        RestaurantManager,
        GeonameManager,
        SimpleLocalStorage,
        $translate,
        GeonameModal,
        UserGeolocation,
        $log,
        Analytics,
        $ionicScrollDelegate,
        MapDistance
    ) {

        var ctrl = this;
        ctrl.restaurants = [];
        ctrl.isAroundMe = false;
        ctrl.loading = true;
        ctrl.loadingCoordinates = true;
        ctrl.searchCriteria  = {
            name: ''
        };
        ctrl.noResult = noResult;
        ctrl.noMoreResult = noMoreResult;
        ctrl.changeGeoname = changeGeoname;
        ctrl.loadMore = loadMore;
        ctrl.viewRestaurant = viewRestaurant;
        ctrl.addNew = addNew;
        ctrl.cancel = cancel;
        ctrl.activateAroundMe = activateAroundMe;
        ctrl.disableAroundMe = disableAroundMe;
        ctrl.getDistance = getDistance;
        ctrl.search = _.debounce(searchRestaurants, 300);
        ctrl.userLocation = {
            lat: 0,
            lng: 0
        };

        initialize();

        function initialize () {
            $log.debug('[CONTROLLER] Initialize');
            ctrl.geoname = SimpleLocalStorage.getObject('restoSearchGeoname');
            $scope.$on('$ionicView.afterLeave', onLeave);
            $scope.$on('$ionicView.enter', onEnter);
            UserGeolocation.getCurrentPosition().then(function(location){
                ctrl.userLocation = location;
                ctrl.loadingCoordinates = false;
                if (ctrl.isAroundMe) {
                    searchRestaurants();
                }
            });
        }

        function onEnter () {
            ctrl.search();
        }

        function onLeave () {
            ctrl.searchCriteria.name = '';
            ctrl.restaurants = [];
        }

        function searchRestaurants() {
            $log.debug('[CONTROLLER] Search restaurants', ctrl.searchCriteria.name);
            ctrl.loading = true;
            ctrl.restaurants.length = 0;
            if (ctrl.isAroundMe) {
                if (ctrl.loadingCoordinates) {
                    return;
                }
                searchRestaurantsAroundMe();
            } else if (ctrl.searchCriteria.name.trim() === '') {
                searchTopRestaurants();
            } else {
                searchRestaurantsByName();
            }
        }

        function searchRestaurantsAroundMe() {
            RestaurantManager.findNearLocation(ctrl.userLocation.lat, ctrl.userLocation.lng, ctrl.searchCriteria.name)
                .then(function (restaurants) {
                    ctrl.restaurants = restaurants;
                    ctrl.loading = false;
                });
        }

        function searchTopRestaurants () {
            $log.debug('[CONTROLLER] Search top restaurants');
            RestaurantManager.findTopRestaurants(ctrl.geoname.id)
                .then(function(restaurants){
                    ctrl.loading = false;
                    ctrl.restaurants = restaurants;
                });
        }

        function searchRestaurantsByName () {
            $log.debug('[CONTROLLER] Search by name');
            var restaurantSearch = RestaurantManager.findByName(ctrl.searchCriteria.name, ctrl.geoname.id);
            restaurantSearch.then(function(restaurants) {
                ctrl.loading = false;
                ctrl.restaurants = restaurants;
            });
        }

        function noMoreResult () {
            $log.debug('[CONTROLLER] No more result', ctrl.restaurant.$metadata.hasNextPage === false);
            if (ctrl.loading) {
                return false;
            }

            return ctrl.restaurant.$metadata.hasNextPage === false;
        }

        function noResult () {
            return ctrl.restaurants.length === 0 &&
                ctrl.searchCriteria.name !== '' &&
                ctrl.loading === false;
        }

        function cancel () {
            ctrl.searchCriteria.name = '';
        }

        function loadMore () {
            $log.debug('[CONTROLLER] Load more');
            return ctrl.restaurants.$fetchMore().$asPromise()
                .finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function viewRestaurant (restaurant) {
            $state.go('restaurantView', {restaurantId: restaurant.id});
        }

        function addNew (place) {
            var params = {};

            if (place && place.id) {
                params.placeId = place.id;
            } else {
                params.name = ctrl.searchCriteria.name;
            }

            return $state.go('restaurantCreate', params);
        }

        function changeGeoname() {
            GeonameModal.create()
                .then(function(geoname) {
                    ctrl.geoname = {};
                    angular.copy(geoname, ctrl.geoname);
                    SimpleLocalStorage.setObject('restoSearchGeoname', geoname);
                    ctrl.cancel();
                    ctrl.search();
                    Analytics.trackEvent('restaurant', 'change_geoname_on_search');
                    return geoname;
                });
            }

        function activateAroundMe () {
            Analytics.trackView('restaurantSearchAroundMe');
            ctrl.isAroundMe = true;
            $ionicScrollDelegate.scrollTop();
            searchRestaurants();
        }

        function disableAroundMe () {
            ctrl.isAroundMe = false;
            $ionicScrollDelegate.scrollTop();
            searchRestaurants();
        }

        function getDistance (restaurant) {
            if (!ctrl.isAroundMe) {
                return false;
            }

            return MapDistance.getFormattedDistance(restaurant, ctrl.userLocation);
        }

    });
