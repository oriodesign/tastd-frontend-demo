'use strict';

angular
    .module('services.utility')
    .directive('debugJson', function DebugJsonDirective(DebugJson) {

        return {
            restrict : 'EA',
            templateUrl: 'js/services/utility/debug-json-directive.html',
            scope : {
                content : '=debugJson'
            },
            controller :['$scope', function ($scope) {
                $scope.hide = true;
                $scope.DebugJson = DebugJson;
                $scope.title= '';
            }],
            link : function (scope, elem, attrs) {
                scope.label = attrs.debugJson || 'unknown';
                scope.$watch('content', function (val) {
                    scope.contentInfo = contentInfo(val);
                }, true);
            }
        };

        function contentInfo(object) {
            var info = {
                type : Object.prototype.toString.call( object ),
                __toString : function () {
                    return '{ type : ' + this.type +
                        (angular.isDefined(this.size) ? ', size : ' + this.size + ' ' : '') +
                        ' }';
                }
            };
            if(angular.isArray(object)) {
                info.size = object.length;
            }
            if(object && object.$$type) {
                info.type = info.type + '[' + object.$$type + ']';
            }

            return info;
        }
    });


