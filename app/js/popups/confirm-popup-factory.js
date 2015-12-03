'use strict';

angular
    .module('popups')
    .factory('ConfirmPopup', function ConfirmPopupFactory (
        $translate,
        $ionicPopup
    ) {
        return {
            create: create
        };

        function create (title, text) {
            return $ionicPopup.confirm({
                title: $translate.instant(title),
                template: $translate.instant(text)
            });
        }
    });
