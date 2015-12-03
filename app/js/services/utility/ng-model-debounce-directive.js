'use strict';

angular
    .module('services.utility')
    .directive('ngModelDebounce', function NgModelDebounceDirective($timeout, $parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 99,
            link: function(scope, elm, attr, ngModelCtrl) {

                var immediateExpression;

                if (attr.type === 'radio' || attr.type === 'checkbox') { return; }

                elm.unbind('input');

                if(attr.ngModelDebounceImmediate) {
                    immediateExpression = $parse(attr.ngModelDebounceImmediate);
                }

                var debounce;
                elm.bind('input', function() {

                    if (immediateExpression) {
                        immediateExpression(scope, {
                            $val : elm.val()
                        });
                    }

                    $timeout.cancel(debounce);
                    debounce = $timeout( function() {
                        scope.$apply(function() {
                            ngModelCtrl.$setViewValue(elm.val());
                        });
                    }, attr.ngModelDebounce || 1000);
                });

                elm.bind('blur', function() {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                });
            }
        };
    });
