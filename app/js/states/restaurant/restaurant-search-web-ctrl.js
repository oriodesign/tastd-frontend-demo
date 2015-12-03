'use strict';


angular
    .module('states.restaurant')
    .controller('RestaurantSearchWebCtrl', function (
        $scope,
        $ionicModal,
        $state,
        RestaurantManager,
        PlaceManager,
        GeonameManager,
        SimpleLocalStorage,
        $translate,
        GeonameModal,
        UserGeolocation,
        $log,
        Analytics,
        $ionicScrollDelegate,
        MapDistance,
        $stateParams
    ) {

        var ctrl = this;
        ctrl.places = [];

        ctrl.loading = true;
        ctrl.searchCriteria  = {
            name: ''
        };
        ctrl.noResult = noResult;
        ctrl.changeGeoname = changeGeoname;
        ctrl.viewRestaurant = viewRestaurant;
        ctrl.addNew = addNew;
        ctrl.search = _.debounce(searchRestaurants, 300);

        initialize();

        function initialize () {
            $log.debug('[CONTROLLER] Initialize');
            ctrl.searchCriteria.name = $stateParams.name;
            ctrl.geoname = SimpleLocalStorage.getObject('restoSearchGeoname');
            $scope.$on('$ionicView.afterLeave', onLeave);
            $scope.$on('$ionicView.enter', onEnter);
        }

        function onEnter () {
            ctrl.search();
        }

        function onLeave () {
            ctrl.searchCriteria.name = '';
            ctrl.places = [];
        }

        function searchRestaurants() {
            $log.debug('[CONTROLLER] Search restaurants', ctrl.searchCriteria.name);
            ctrl.loading = true;
            ctrl.places.length = 0;
            $log.debug('[CONTROLLER] Search by name');
            var placesSearch = PlaceManager.findAll(ctrl.geoname.lat, ctrl.geoname.lng, ctrl.searchCriteria.name);
            placesSearch.then(function(places){
                $log.debug('[CONTROLLER] Place results', places);
                ctrl.places = PlaceManager.removeDuplicates(places);
                $log.debug('[CONTROLLER] Filtered places', ctrl.places);
                ctrl.loading = false;
            });

        }

        function noResult () {
            return ctrl.places.length === 0 &&
                ctrl.loading === false;
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
                    ctrl.searchCriteria.name = '';
                    ctrl.search();
                    Analytics.trackEvent('restaurant', 'change_geoname_on_search');
                    return geoname;
                });
        }

    });
