'use strict';

angular
    .module('entities.review', [
        'entities.restmod'
    ])
    .factory('ReviewBatch', function ReviewBatchFactory(restmod) {

        var ReviewBatch = restmod.model().mix({
            $$type : 'ReviewBatch',
            $config: {
                name: 'batch',
                plural: 'batch'
            }
        });

        return ReviewBatch;
    });
