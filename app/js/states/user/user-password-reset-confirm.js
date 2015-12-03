'use strict';

angular
    .module('states.user')
    .controller('PasswordConfirmCtrl', function (
        Security,
        $scope,
        $stateParams
    ) {

        var ctrl = this;

        $scope.password = {};

        ctrl.confirm = function () {
            // validation client side?
            if ($scope.password.new === $scope.password.retype) {
                // TODO: bind the service: does the exposed API have such a service?

                Loader.track(Security.confirmResetPassword({
                    password : $scope.password.new,
                    'confirmation-token' : $stateParams.token
                })
                    .then(function () {
                        $state.go('me');
                    }, function (res) {

                    }));
            } else {
                $scope.password.new = '';
                $scope.password.retype = '';
            }
        };

        return ctrl;
    });
