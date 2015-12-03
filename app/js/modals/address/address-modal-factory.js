'use strict';

angular
    .module('modals.address',[])
    .factory('AddressModal', function AddressModalFactory(
        $ionicModal,
        GoogleGeocoder,
        $q,
        $log,
        $rootScope,
        Google,
        GeocodeMap,
        Loader,
        UserGeolocation,
        $translate
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.search = _.debounce(search, 300);
        modalScope.choose = choose;
        modalScope.edit = edit;
        modalScope.stopEdit = stopEdit;
        modalScope.done = done;
        modalScope.centerOnMe = centerOnMe;
        modalScope.getInputLabel = getInputLabel;
        modalScope.geoname = null;
        modalScope.editing = false;
        modalScope.chosenAddress = null;

        return {
            create: create
        };

        function getInputLabel () {
            return (modalScope.chosenAddress && modalScope.chosenAddress.formattedAddress)
                || $translate.instant('modal.address.field');
        }

        function create (city, addressString) {
            $log.debug('[ADDRESS_MODAL] Create');
            deferred = $q.defer();
            modalScope.addresses = [];
            modalScope.geoname = city;
            modalScope.parameters = {
                name: city.asciiName + ', ' + (addressString ? addressString : '' )
            };
            modalScope.$on('geocodeMap.address', onGeocodeMapAddress);
            createModal();
            if (modalScope.parameters.name !== '') {
                searchAutoSelect();
            }

            return deferred.promise;
        }

        function onGeocodeMapAddress (event, address) {
            modalScope.chosenAddress = address;
            modalScope.parameters.name = address.formattedAddress;
            modalScope.editing = false;
        }

        function edit () {
            $log.debug('[ADDRESS_MODAL] Edit');
            modalScope.editing = true;
        }

        function stopEdit () {
            $log.debug('[ADDRESS_MODAL] Stop edit');
            modalScope.editing = false;
        }

        function search () {
            $log.debug('[ADDRESS_MODAL] Search start');
            modalScope.addresses.length = 0;
            modalScope.loading = true;
            GoogleGeocoder.geocode(modalScope.parameters.name)
                .then(function (addresses) {
                    $log.debug('[ADDRESS_MODAL] Search end');
                    modalScope.addresses = addresses;
                    modalScope.loading = false;
                });
        }

        function searchAutoSelect () {
            $log.debug('[ADDRESS_MODAL] Search start with auto select');
            modalScope.addresses.length = 0;
            modalScope.loading = true;
            GoogleGeocoder.geocode(modalScope.parameters.name)
                .then(function (addresses) {
                    $log.debug('[ADDRESS_MODAL] Search with auto select end');
                    modalScope.addresses = addresses;
                    modalScope.loading = false;
                    if (addresses.length > 0) {
                        choose(addresses[0]);
                    }
                });
        }

        function createModal () {
            $log.debug('[ADDRESS_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/address/address-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(afterCreateModal);
        }
        function afterCreateModal (modal) {
            ionicModal = modal;
            modal.show();
            GeocodeMap.create(modalScope.geoname.lat, modalScope.geoname.lng);
        }

        function choose (address) {
            $log.debug('[ADDRESS_MODAL] Choose');
            modalScope.chosenAddress = address;
            modalScope.parameters.name = address.formattedAddress;
            modalScope.editing = false;
            GeocodeMap.centerMapTo(address.lat, address.lng);
        }

        function done () {
            deferred.resolve(modalScope.chosenAddress);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[ADDRESS_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[ADDRESS_MODAL] Clean up');
            modalScope.addresses = [];
            modalScope.parameters.name = '';
            modalScope.geoname = null;
            modalScope.editing = false;
            modalScope.chosenAddress = null;
            ionicModal.remove();
        }

        function centerOnMe () {
            $log.debug('[ADDRESS_MODAL] Center on me');
            Loader.track(UserGeolocation.getCurrentPosition()
                .then(function(coordinates){
                    $log.debug('[ADDRESS_MODAL] After center on me', coordinates);
                    GoogleGeocoder.reverseGeocode(coordinates.lat, coordinates.lng)
                        .then(function (addresses) {
                            $log.debug('[ADDRESS_MODAL] After reverse geolocation', addresses);
                            if (addresses[0]) {
                                GeocodeMap.centerMapTo(coordinates.lat, coordinates.lng);
                                modalScope.chosenAddress = addresses[0];
                                modalScope.parameters.name = addresses[0].formattedAddress;
                                modalScope.editing = false;
                            }
                        });
                }));
        }

    });
