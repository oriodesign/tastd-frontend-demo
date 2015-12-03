'use strict';

angular
    .module('states.invite')
    .controller('InviteHomeCtrl', function InviteHomeCtrl(
        $http,
        $q,
        Config,
        SimpleLocalStorage,
        $scope,
        me,
        $log,
        $cordovaSocialSharing,
        $translate,
        Analytics
    ) {

        var ctrl = this;
        var title = $translate.instant('invite.share.title');
        var message = $translate.instant('invite.share.message');

        ctrl.publishOnFb = function() {
            if (!window.plugins) {
                return window.alert('No cordova no party');
            }

            var url = 'https://tastdapp.com?invite&user=' + me.id;

            Analytics.trackEvent('share', 'invite');

            return $cordovaSocialSharing
                .share(message, title, null, url);
        };

    });
