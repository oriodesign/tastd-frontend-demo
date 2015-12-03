'use strict';

angular
    .module('directives.flashMessage', [
        'services.flashMessage'
    ])
    .directive('flashMessage', function(
    ){
        return {
            restrict: 'E',
            scope: {},
            templateUrl : 'js/directives/flash-message/flash-message.html',
            controllerAs : 'ctrl',
            controller : function(FlashMessageManager){
                var ctrl = this;
                ctrl.reset = reset;
                ctrl.manager = FlashMessageManager;
                function reset($event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    FlashMessageManager.reset();
                }
            }
        };
    });
