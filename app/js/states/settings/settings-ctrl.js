'use strict';

angular
    .module('states.settings')

    .controller('SettingsCtrl', function (
        Security,
        ConfirmPopup,
        Loader,
        $state
    ) {

        var ctrl = this;

        ctrl.goToPrivacy = function() {
            window.open('https://s3.amazonaws.com/tasted/email/tastdapp-privacy.pdf', '_system');
        };

        ctrl.goToTerms = function() {
            window.open('https://s3.amazonaws.com/tasted/email/tastdapp-terms.pdf', '_system');
        };

        ctrl.logout = function () {
            ConfirmPopup.create('popup.logout.title','popup.logout.text')
                .then(function (res) {
                if (res) {
                    return Loader.track(Security.logout()
                        .then(function () {
                            Loader.$loading.hide();
                            $state.go('landing');
                        }));
                }
            });
        };
    });
