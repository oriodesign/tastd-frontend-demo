'use strict';

angular
    .module('states.settings')

    .controller('FeedbackCtrl', function (
        $scope,
        MessageHelper,
        Loader,
        $state,
        FlashMessageManager
    ) {

        var ctrl = this;
        $scope.feedback = {};

        $scope.sendFeedback = function () {
            var msg = {};
            angular.extend(msg, $scope.feedback, {
                category : 'INFO'
            });
            return Loader.track(MessageHelper.sendMessage(msg))
                .then(function (response) {
                    FlashMessageManager.push('flash_message.feedback_sent', 'success');
                    $state.go('settings');
                    Loader.$loading.hide();
                    return response;
                });
            };

    });
