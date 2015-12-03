'use strict';

angular
    .module('services.google')
    .factory('GoogleGeocoder', function GoogleGeocoderFactory(
        Google,
        $log,
        $q
    ) {
        var deferred = null;
        var GoogleGeocoder = {
            geocode: geocode,
            reverseGeocode: reverseGeocode
        };

        return GoogleGeocoder;

        function geocode(address) {
            deferred = $q.defer();
            var geocoder = new Google.maps.Geocoder();
            $log.debug('[GOOGLE_GEOCODER] Geocode');
            geocoder.geocode({'address': address}, function(results, status) {
                if (status === Google.maps.GeocoderStatus.OK) {
                    $log.debug('[GOOGLE_GEOCODER] Status raw result', results);
                    geocodeResultToAddresses(results);
                } else {
                    $log.debug('[GOOGLE_GEOCODER] Failure', status);
                    deferred.resolve([]);
                }
            });
            return deferred.promise;
        }

        function geocodeResultToAddresses (results) {
            var addresses = [];
            _.each(results, function (result) {
                var address = {};
                if (!result.geometry || !result.geometry.location) {
                    return;
                }
                address.lat = result.geometry.location.lat();
                address.lng = result.geometry.location.lng();
                address.route = getComponent(result.address_components, 'route');
                address.streetAddress = getComponent(result.address_components, 'street_address');
                address.intersection = getComponent(result.address_components, 'intersection');
                address.country = getComponent(result.address_components, 'country');
                address.postalCode = getComponent(result.address_components, 'postalCode');
                address.premise = getComponent(result.address_components, 'premise'); // Group of building
                address.subPremise = getComponent(result.address_components, 'subpremise'); // Single building
                address.neighborhood = getComponent(result.address_components, 'neighborhood');
                address.locality = getComponent(result.address_components, 'locality');
                address.subLocality = getComponent(result.address_components, 'sublocality');

                address.subLocalityLevel1 = getComponent(result.address_components, 'sublocality_level_1');
                address.subLocalityLevel2 = getComponent(result.address_components, 'sublocality_level_2');
                address.subLocalityLevel3 = getComponent(result.address_components, 'sublocality_level_3');
                address.subLocalityLevel4 = getComponent(result.address_components, 'sublocality_level_4');
                address.subLocalityLevel5 = getComponent(result.address_components, 'sublocality_level_5');

                address.administrativeAreaLevel1 = getComponent(result.address_components, 'administrative_area_level_1');
                address.administrativeAreaLevel2 = getComponent(result.address_components, 'administrative_area_level_2');
                address.administrativeAreaLevel3 = getComponent(result.address_components, 'administrative_area_level_3');
                address.administrativeAreaLevel4 = getComponent(result.address_components, 'administrative_area_level_4');
                address.administrativeAreaLevel5 = getComponent(result.address_components, 'administrative_area_level_5');
                address.streetNumber = getComponent(result.address_components, 'street_number');
                address.formattedAddress = result.formatted_address;

                var shortAddressComponents = getComponentsForShortAddress(address);

                if (shortAddressComponents.length === 0) {
                    return;
                }

                if (address.streetNumber) {
                    address.shortAddress = address.streetNumber + ', ' + shortAddressComponents.join(' ');
                } else {
                    address.shortAddress = shortAddressComponents.join(' ');
                }

                addresses.push(address);
            });

            $log.debug('[GOOGLE_GEOCODER] Addresses Results', addresses);
            deferred.resolve(addresses);
        }

        function getComponentsForShortAddress (address) {
            var components = [];
            _.each([
                'streetAddress',
                'route',
                'intersection',
                'premise',
                'subPremise',
                'neighborhood',
                'subLocalityLevel1',
                'subLocalityLevel2',
                'subLocalityLevel3',
                'subLocalityLevel4',
                'subLocalityLevel5'], function(c){
                if (address[c]) {
                    components.push(address[c]);
                }
            });

            return components;
        }

        function getComponent(addressComponents, name) {
            var component = _.find(addressComponents, function (component) {
                return _.contains(component.types, name);
            });
            if (component && component.long_name) {
                return component.long_name;
            } else if (component) {
                return component;
            }

            return undefined;
        }

        function reverseGeocode (lat, lng) {
            deferred = $q.defer();
            var coordinates = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
            var geocoder = new Google.maps.Geocoder;
            geocoder.geocode({'location': coordinates}, function(results, status) {
                if (status === Google.maps.GeocoderStatus.OK) {
                    geocodeResultToAddresses(results);
                } else {
                    deferred.resolve([]);
                }
            });

            return deferred.promise;
        }

    });
