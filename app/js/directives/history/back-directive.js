'use strict';

angular
    .module('directives.history')
    .directive('back', function BackDirective() {
        return {
            restrict : 'E',
            scope: {
            },
            controller : function ($scope, $ionicHistory, $log, $state) {
                $scope.back = function(){
                    var backView = $ionicHistory.backView();
                    if (!backView) {
                        return $state.go('wall');
                    }

                    $log.debug('[BACK] Try to go to back state ' + backView.stateId);
                    if (backView && backView.stateId.indexOf('restaurantCreate') > -1) {
                        return $ionicHistory.goBack(-2);
                    }
                    return $ionicHistory.goBack();
                };
            },
            template : '<div class="back-button" ng-click="back()"' +
                'class="header-button"><i class="icon ion-arrow-left-c"></i></div>'
        };
    });
