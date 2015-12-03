'use strict';

angular
    .module('directives.cuisine')
    .directive('cuisine', function CuisineDirective() {
        return {
            restrict : 'EA',
            scope: {
                cuisine : '=cuisineModel',
                disabled : '=disabled',
                icon: '=icon'
            },
            template : '<div ng-if="cuisine" class="cuisine">' +
                '<div class="cuisine-avatar" ng-style="disabled? {} : {background:\'#\'+ cuisine.color }">' +
                '<i ng-class="disabled || icon ? {\'icon-cuisine\':true}: {\'icon-checkmark-round\':true}" class="icon"></i></div>'+
                '<div class="cuisine-name">{{ cuisine.name }}</div>' +
                '</div>'
        };
    });
