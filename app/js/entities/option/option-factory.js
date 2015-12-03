'use strict';

angular
    .module('entities.option')
    .factory('Option', function OptionFactory(restmod, RestBase) {
        var Option = restmod
            .model('/options')
            .mix(RestBase, {
                $$type : 'Option'
            });
        return Option;
    });
