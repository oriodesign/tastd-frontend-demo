'use strict';

angular
    .module('directives.cuisine')
    .directive('selectCuisine', function SelectCuisineDirective() {

        return {
            restrict : 'EA',
            templateUrl : 'js/directives/cuisine/select-cuisine.html',
            controller : function ($scope, CuisineModal) {

                $scope.openModal = function () {
                    CuisineModal.create()
                        .then(function (cuisine) {
                            $scope.item.cuisine = cuisine;
                        });
                };
            },
            scope : {
                item : '=',
                cuisines : '='
            }
        };
    });
