'use strict';

angular
    .module('entities.leader')
    .factory('LeaderBatch', function LeaderBatchFactory(restmod) {

        var LeaderBatch = restmod.model().mix({
            $$type : 'LeaderBatch',
            $config: {
                name: 'batch',
                plural: 'batch'
            }
        });

        return LeaderBatch;
    });
