'use strict';

angular
    .module('services.photo', [])

    .factory('PhotoUpload', function PhotoFactory(
        $ionicActionSheet,
        $cordovaCamera,
        $translate
    ) {

        function uploadPhotoFactory(callback) {
            return function () {
                var options = {
                    quality : 75,
                    destinationType : 0, //Camera.DestinationType.DATA_URL,
                    // targetWidth : 800,
                    // targetHeight : 600,
                    allowEdit : true
                };

                var hideSheet = $ionicActionSheet.show({
                    buttons : [
                        {
                            text : 'Choose from library'
                        },
                        {
                            text : 'Take photo'
                        }
                    ],
                    titleText : $translate.instant('user.choose_picture'),
                    cancelText : $translate.instant('button.cancel'),
                    cancel : function () {
                        // add cancel code..
                    },
                    buttonClicked : function (index) {
                        options.sourceType = (index === 0) ? 0 : 1;
                        hideSheet();

                        if (!window.cordova) {
                            window.alert('No cordova camera plugin');
                            return null;
                        }

                        $cordovaCamera.getPicture(options).then(function (imageData) {
                            callback(imageData);
                        });
                    }
                });
            };
        }


        return {
            uploadPhotoFactory : uploadPhotoFactory
        };
    });
