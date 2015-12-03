'use strict';

angular
    .module('states.restaurant')

    .controller('RestaurantEditCtrl', function (
        Loader,
        Analytics,
        EventDispatcher,
        CuisineManager,
        RestaurantManager,
        $stateParams,
        FlashMessageManager
    ) {
        var ctrl = this;

        ctrl.cuisines = [];
        ctrl.form = {};

        initialize();

        function initialize () {
            loadCuisines();
            loadRestaurant();
        }

        function loadCuisines () {
            CuisineManager.findAll()
                .then(function (cuisines) {
                    ctrl.cuisines = cuisines;
                });
        }

        function loadRestaurant () {
            RestaurantManager.findOneById($stateParams.restaurantId)
                .then(function (r) {
                    ctrl.restaurant = r;
                });
        }

        ctrl.save = function () {
            EventDispatcher.broadcast(EventDispatcher.event.RESTAURANT_CREATE);
            var promise = ctrl.restaurant.$save().$asPromise();
            Loader.track(promise);
            promise.then(function(){
                FlashMessageManager.push('flash_message.restaurant_updated', 'success');
            });
        };

    });

