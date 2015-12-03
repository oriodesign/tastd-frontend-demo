'use strict';

angular
    .module('states.user')
    .controller('PasswordResetCtrl', function (
        Security,
        Loader,
        $state,
        $scope,
        ConfirmPopup,
        FlashMessageManager
    ) {

        var ctrl = this;

        $scope.reset = {
            email : ''
        };

        ctrl.reset = function () {
            ConfirmPopup.create('popup.reset_password.title', 'popup.reset_password.text')
                .then(function (res) {
                if (res) {
                    return Loader.track(Security.resetPassword({
                        email : $scope.reset.email
                    })
                        .then(function () {
                            FlashMessageManager.push('flash_message.password_sent', 'success');
                            $state.go('signin');
                        }));
                }
            });

        };

        return ctrl;
    });
