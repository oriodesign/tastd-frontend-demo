'use strict';

angular
    .module('states.onBoarding')
    .controller('OnBoardingIntroCtrl', function (
        $log,
        $state,
        me
    ) {
        var ctrl = this;
        ctrl.name = me.firstName;
        ctrl.next = next;

        function next () {
            $state.go('onBoardingTopRestaurants');
        }


    });
