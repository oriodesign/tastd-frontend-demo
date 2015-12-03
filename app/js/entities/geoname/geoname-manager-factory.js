'use strict';

angular
    .module('entities.geoname')
    .factory('GeonameManager', function GeonameManagerFactory(
        Security,
        Geoname,
        EntityManager
    ) {

        return _.extend(new EntityManager(Geoname), {
            getSearchParameters : getSearchParameters,
            findAll: findAll,
            createFromStateParams: createFromStateParams
        });

        function createFromStateParams ($stateParams) {
            return {
                id: $stateParams.cityId,
                asciiName: $stateParams.cityName,
                lat: parseFloat($stateParams.lat),
                lng: parseFloat($stateParams.lng)
            };
        }

        function findAll (p) {
            if (typeof p === 'string') {
                p = {
                    asciiName: p
                };
            }
            return Geoname.$search(p).$asPromise();
        }

        function getSearchParameters (q) {
            var parameters = {};
            if (q) {
                parameters.asciiName = q;
            } else {
                parameters.user = Security.user.id;
            }
            return parameters;
        }
    });

