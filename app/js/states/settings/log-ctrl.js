'use strict';

angular
    .module('states.settings')
    .controller('LogCtrl', function LogCtrl(
        LogStack
    ) {

        var ctrl = this;
        ctrl.copy = copy;
        ctrl.logStack = LogStack;
        ctrl.logData = LogStack.getFullStack();

        function copy () {

        }


    });
