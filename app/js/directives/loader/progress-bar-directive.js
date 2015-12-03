'use strict';

angular
    .module('directives.loader')
    .directive('progressBar', function ListLoaderDirective() {

        return {
            restrict : 'E',
            templateUrl : 'js/directives/loader/progress-bar.html',
            controllerAs : 'ctrl',
            controller : function (/*$scope, Loader, $state*/) {
                var ctrl = this;
            },
            scope : {
                progress: '='
            }
        };
    });


