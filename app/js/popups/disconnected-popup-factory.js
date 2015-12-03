'use strict';

angular
    .module('popups')
    .factory('DisconnectedPopup', function DisconnectedPopupFactory (
        $translate,
        $ionicPopup
    ) {
        return {
            create: create
        };

        function create () {
            return $ionicPopup.confirm({
                title : $translate.instant('popup.disconnected.title'),
                template : $translate.instant('popup.disconnected.text'),
                okText : $translate.instant('popup.disconnected.ok')
            });
        }
    });
