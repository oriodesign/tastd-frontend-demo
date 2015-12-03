'use strict';

angular
    .module('entities.cuisine')
    .factory('Cuisine', function CuisineFactory(restmod, RestBase) {
        var Cuisine = restmod
            .model('/cuisines')
            .mix(RestBase, {
                $$type : 'Cuisine'
            });
        return Cuisine;
    });
