'use strict';

angular
    .module('entities.place', [])
    .factory('PlaceManager', function PlaceManagerFactory (
        $http,
        Config,
        $q
    ) {
        return {
            findAll: findAll,
            removeDuplicates: removeDuplicates
        };

        function findAll(lat, lng, name) {
            var deferred = $q.defer();
            var url = Config.apiUrl('/google-places/place-results');
            var options = {
                latitude: lat,
                longitude: lng,
                name: name
            };
            $http.get(url, {params: options})
                .then(function(response) {
                    if (response.data && response.data.placeResults) {
                        return deferred.resolve(response.data.placeResults);
                    }
                    return deferred.resolve([]);
                });

            return deferred.promise;
        }

        function removeDuplicates(placeResults){
            var results = [];
            angular.forEach(placeResults, function(p1) {
                var unique = true;
                angular.forEach(results, function(p2) {
                    if (p1.name === p2.name) {
                        unique = false;
                    }
                });
                if(unique){
                    results.push(p1);
                }
            });

            return results;
        }

    });
