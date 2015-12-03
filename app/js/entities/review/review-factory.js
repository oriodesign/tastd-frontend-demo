'use strict';

angular
    .module('entities.review')
    .factory('Review', function ReviewFactory(restmod) {

        var Review = restmod.model('/reviews').mix({
            batch: {
                hasMany: 'ReviewBatch'
            },
            $$type : 'Review',
            $config: {
                name: 'review',
                plural: 'reviews'
            }
        });

        return Review;
    });
