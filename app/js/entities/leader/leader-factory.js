'use strict';

angular
    .module('entities.leader')
    .factory('Leader', function LeaderFactory(restmod, ConnectedUserBase) {

        var Leader = restmod
            .model()
            .mix('User', ConnectedUserBase, {
                batch: {
                    hasMany: 'LeaderBatch'
                },
                $$type : 'Leader', // fake type
                $config: {
                    name: 'leader', // if you only set NAME, then plural is infered from it using the inflector.
                    plural: 'leaders'
                }
            });

        Leader.$$type = 'Leader';

        return Leader;
    });
