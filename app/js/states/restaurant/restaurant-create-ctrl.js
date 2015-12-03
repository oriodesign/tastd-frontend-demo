'use strict';

angular
    .module('states.restaurant')
    .controller('RestaurantCreateCtrl', function (
        $scope,
        CuisineManager,
        RestaurantManager,
        Loader,
        Analytics,
        EventDispatcher,
        $state,
        $stateParams,
        DuplicatedRestaurantPopup,
        SimpleLocalStorage,
        $log,
        $q
    ) {
        var ctrl = this;
        ctrl.cuisines = [];
        ctrl.form = {};
        ctrl.save = save;
        ctrl.loading = true;

        initialize();

        function initialize () {
            $log.debug('[CONTROLLER] Initialize');
            CuisineManager.findAll().then(function (cuisines) {
                ctrl.cuisines = cuisines;
            });
            if ($stateParams.placeId) {
                importRestaurantFromGooglePlace();
            } else {
                createNewRestaurant();
            }
            $scope.$on('navbar.done', onNavbarDone);
        }

        function onNavbarDone () {
            ctrl.form.execIfValid(ctrl.save);
        }

        function createNewRestaurant () {
            $log.debug('[CONTROLLER] Create New restaurant');
            ctrl.restaurant = RestaurantManager.buildRestmodResource();
            ctrl.restaurant.geoname = SimpleLocalStorage.getObject('restoSearchGeoname');
            if ($stateParams.name) {
                ctrl.restaurant.name = $stateParams.name;
            }

            ctrl.loading = false;
        }

        function importRestaurantFromGooglePlace () {
            $log.debug('[CONTROLLER] Import from google place');
            RestaurantManager.buildFromPlaceId($stateParams.placeId)
                .then(function (restaurant) {
                    $log.debug('[CONTROLLER] Restaurant imported');
                    ctrl.restaurant = restaurant;
                    ctrl.restaurant.geoname = SimpleLocalStorage.getObject('restoSearchGeoname');
                    ctrl.loading = false;
                });
        }

        function checkDuplicated () {
            $log.debug('[CONTROLLER] Check duplicated');
            var deferred = $q.defer();
            $log.debug('[CONTROLLER] Name not encoded ' + ctrl.restaurant.name);
            $log.debug('[CONTROLLER] Name encoded ' + encodeURIComponent(ctrl.restaurant.name) );
            var params = {
                lat: ctrl.restaurant.lat,
                lng: ctrl.restaurant.lng,
                name: ctrl.restaurant.name,
                orderBy: 'distance',
                maxDistance: 0
            };
            params.name.replace('\'', '%27');
            RestaurantManager.findAll(params)
                .then(function(restaurants){
                    if (restaurants.length === 0) {
                        deferred.resolve();
                    } else {
                        popup(restaurants);
                        deferred.reject();
                    }
                });

            return deferred.promise;
        }

        function popup(restaurants) {
            DuplicatedRestaurantPopup.create(restaurants)
                .then(function (response) {
                    if (response === 'continue') {
                        persist();
                    }
                });
        }

        function save() {
            $log.debug('[CONTROLLER] Save');
            checkDuplicated()
                .then(persist);
        }

        function persist() {
            EventDispatcher.broadcast(EventDispatcher.event.RESTAURANT_CREATE);
            var promise = RestaurantManager.save(ctrl.restaurant);
            Loader.track(promise).then(onSaveSuccess);
        }

        function onSaveSuccess (restaurant) {
            $log.debug('[CONTROLLER] On Save success');
            Analytics.trackEvent('restaurant', 'create');
            return $state.go('restaurantView', {
                    restaurantId : restaurant.id
                });
        }

    });

