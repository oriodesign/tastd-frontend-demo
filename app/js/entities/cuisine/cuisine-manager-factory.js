'use strict';

angular
    .module('entities.cuisine')
    .factory('CuisineManager', function CuisineManagerFactory(
        Cuisine,
        $q,
        EntityManager
    ) {
        var CuisineManager = _.extend(new EntityManager(Cuisine),{
            findAll: findAll,
            findOneById: findOneById,
            cache: []
        });

        return CuisineManager;

        function findOneById (id) {
            var deferred = $q.defer();
            CuisineManager.findAll().then(function(cuisines){
                var result = _.find(cuisines, function(cuisine) {
                    return parseInt(cuisine.id) === parseInt(id);
                });

                deferred.resolve(result);
            });

            return deferred.promise;
        }

        function findAll() {
            var deferred = $q.defer();

            if (CuisineManager.cache.length !== 0) {
                deferred.resolve(CuisineManager.cache);

                return deferred.promise;
            }

            Cuisine.$search().$asPromise().then(function(cuisines){
                CuisineManager.cache = cuisines;
                deferred.resolve(cuisines);
            });

            return deferred.promise;
        }
    });
