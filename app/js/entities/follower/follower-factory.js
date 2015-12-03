'use strict';

angular
    .module('entities.follower')
    .factory('Follower', function FollowerFactory(restmod, ConnectedUserBase) {

        var Follower = restmod
            .model()
            .mix('User', ConnectedUserBase, {
                $$type : 'Follower', // fake type
                $config: {
                    name: 'follower', // if you only set NAME, then plural is infered from it using the inflector.
                    plural: 'followers'
                }
            });

        Follower.$$type = 'Follower';

        return Follower;
    });
