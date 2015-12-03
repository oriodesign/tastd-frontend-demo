'use strict';

angular
    .module('directives.restaurant')
    .directive('restaurantEdit', function RestaurantEditDirective(
        AddressModal,
        InaccurateAddressPopup,
        $q,
        PhotoUpload,
        GeonameManager,
        GeonameModal,
        ValidatorManager,
        $log
    ) {
        return {
            restrict : 'E',
            replace : true,
            scope : {
                restaurant : '=',
                cuisines : '=',
                form : '=',
                hidePhoto : '='
            },
            templateUrl : 'js/directives/restaurant/restaurant-edit.html',
            controller : function ($scope) {
                var ctrl = this;

                // shown when the form is invalid
                $scope.form.execIfValid = function (callback) {
                    ValidatorManager.validate($scope.restaurantEditForm, $scope)
                        .then(function(){
                            callback()
                        });
                };

                // called on blur to add http:// to the field
                ctrl.prependProtocol = function () {
                    /*
                    var regexp = /^((http|https):\/\/)/;
                    if ($scope.restaurant.website.length > 0 && !regexp.test($scope.restaurant.website)) {
                        $scope.restaurant.website = "http://" + $scope.restaurant.website;
                    }*/
                };

                ctrl.getPhotoStyle = function () {
                    return $scope.restaurant.uploadedPicture ?
                        {'background-image': 'url(data:image/jpg;base64,' + $scope.restaurant.uploadedPicture + ')'} :
                        {'background-image': 'url(' + $scope.restaurant.picture + ')' };
                };

                /**
                 * Choose an address for a new restaurant
                 */
                ctrl.address = function (geoname, addressString) {
                    AddressModal.create(geoname, addressString)
                        .then(function (address) {
                            //
                            if (address.streetNumber
                                || address.subLocalityLevel4
                                || address.subPremise
                                || address.intersection) {
                                return setResult(address);
                            }
                            return InaccurateAddressPopup.create(address)
                                .then(setResult);

                        });
                };

                function setResult(address) {
                    if (address.refused) {
                        return ctrl.address($scope.restaurant.geoname, address.shortAddress);
                    }
                    $log.debug('[RESTAURANT_EDIT] Set address result', address);
                    $scope.restaurant.lat = address.lat;
                    $scope.restaurant.lng = address.lng;
                    $scope.restaurant.address = address.shortAddress;
                }

                /**
                 * Choose a city for a new restaurant
                 */
                ctrl.city = function () {
                    changeGeoname().then(function (geoname) {
                        $scope.restaurant.geoname = geoname;
                    });
                };

                ctrl.uploadPhoto = PhotoUpload.uploadPhotoFactory(function (imageData) {
                    $scope.restaurant.uploadedPicture = imageData;
                });
            },
            controllerAs : 'ctrl'
        };

        function changeGeoname() {
            var deferred = $q.defer();
            GeonameModal.create().then(function(geoname){
                deferred.resolve(geoname);
            });

            return deferred.promise;
        }

    });

