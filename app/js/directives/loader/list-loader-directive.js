'use strict';

angular
    .module('directives.loader')
    .directive('listLoader', function ListLoaderDirective() {

        return {
            restrict : 'E',
            templateUrl : 'js/directives/loader/list-loader.html',
            controllerAs : 'ctrl',
            controller : function (/*$scope, Loader, $state*/) {
                var ctrl = this;
            },
            scope : {
                loading : '='
            }
        };
    });

