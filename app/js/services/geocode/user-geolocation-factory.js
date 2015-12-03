'use strict';

angular
    .module('services.geocode')
    .factory('UserGeolocation', function UserGeolocationFactory(
        $cordovaGeolocation,
        GeonameManager,
        AlertPopup,
        $q,
        SimpleLocalStorage,
        $log
    ) {
        var UserGeolocation = {
            address: null,
            getCurrentGeoname: getCurrentGeoname,
            getCurrentPosition: getCurrentPosition
        };

        return UserGeolocation;

        function getCurrentGeoname () {
            $log.debug('[GEOLOCATION] Get Current Geoname');
            var deferred = $q.defer();
            var lastGeoname = SimpleLocalStorage.getObject('lastGeoname');
            if (lastGeoname && lastGeoname.lat) {
                $log.debug('[GEOLOCATION] Resolve with lastGeoname');
                deferred.resolve(lastGeoname);
            } else {
                var userGeolocationPromise = UserGeolocation.getCurrentPosition();
                var geonameManagerPromise = userGeolocationPromise.then(function (coordinates) {
                    var q = angular.extend({}, coordinates, {
                        orderBy: 'distance'
                    });

                    return GeonameManager.findAll(q);
                });
                geonameManagerPromise.then(function(geonames) {
                    $log.debug('[GEOLOCATION] On Geoname manager success');
                    if (geonames.length > 0) {
                        deferred.resolve(geonames[0]);
                    } else {
                        deferred.reject();
                    }
                });
            }

            return deferred.promise;
        }

        function getCurrentPosition() {
            $log.debug('[GEOLOCATION] Get Current position');
            var deferred = $q.defer();
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: true
            };
            var currentPositionPromise = $cordovaGeolocation.getCurrentPosition(posOptions);
            currentPositionPromise.then(function (position) {
                    $log.debug('[GEOLOCATION] Success with lat: ' +
                        position.coords.latitude +
                        ' and lng: ' +
                        position.coords.longitude
                    );
                    deferred.resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, function() {
                    $log.debug('[GEOLOCATION] Failure');
                    AlertPopup.create('popup.geolocation_not_available.title','popup.geolocation_not_available.text');
                    deferred.resolve({
                        lat: 40.7670374,
                        lng: -73.9711997
                    });
                });

            return deferred.promise;
        }


    });
