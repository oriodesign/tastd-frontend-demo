'use strict';

angular
    .module('entities.flag')
    .factory('Flag', function (restmod) {
        var Flag = restmod.model('/flags').mix({
            $$type : 'Flag'
        });

        return Flag;
    });
