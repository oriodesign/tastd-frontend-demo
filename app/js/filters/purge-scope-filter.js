'use strict';

angular
    .module('filters')
    .filter('purgeScope', function () {

        function purgeObj(obj){
            return _.omit(obj, '$scope');
        }

        var purge = function (input) {
            if( _.isArray(input)){
                return _.reduce(input, function(memo, item){
                    memo.push(purgeObj(item));
                    return memo;
                }, []);
            }
            else{
                return purgeObj(input);
            }
        };

        return purge;
    });
