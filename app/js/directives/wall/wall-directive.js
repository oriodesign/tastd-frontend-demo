'use strict';

angular
    .module('directives.wall')
    .directive('wall', function WallDirective() {

        var WALL_TPL_URL = 'js/directives/wall/wall.html';

        return {
            restrict : 'E',
            replace : true,
            templateUrl : WALL_TPL_URL,
            controllerAs : 'ctrl',
            controller : function (
                ReviewManager,
                $scope
            ) {
                var ctrl = this;

                ctrl.loadMore = function () {
                    return $scope.reviews.$fetchMore().$asPromise()
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                };

                return ctrl;
            },
            scope : {
                me: '=',
                page: '@',
                reviews: '=',
                hideSignature: '='
            }
        };

    });

