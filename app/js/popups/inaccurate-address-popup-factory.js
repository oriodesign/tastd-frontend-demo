'use strict';

angular
    .module('popups')
    .factory('InaccurateAddressPopup', function InaccurateAddressPopupFactory (
        $translate,
        $rootScope,
        $ionicPopup
    ) {

        return {
            create: create
        };

        function create (address) {
            return $ionicPopup.show({
                title : $translate.instant('popup.inaccurate_address.title'),
                subTitle : $translate.instant('popup.inaccurate_address.text'),
                buttons : [{
                    text : $translate.instant('popup.inaccurate_address.ok'),
                    type : 'button-default',
                    onTap : function () {
                        return address;
                    }
                }, {
                    text : $translate.instant('popup.inaccurate_address.no'),
                    type : 'button-positive',
                    onTap : function () {
                        address.refused = true;
                        return address;
                    }
                }]
            });
        }

    });
