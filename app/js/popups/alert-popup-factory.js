'use strict';

angular
    .module('popups')
    .factory('AlertPopup', function AlertPopupFactory (
        $translate,
        $ionicPopup
    ) {
        return {
            create: create
        };

        function create (title, text) {
            return $ionicPopup.alert({
                title: $translate.instant(title),
                template: $translate.instant(text)
            });
        }
    });
