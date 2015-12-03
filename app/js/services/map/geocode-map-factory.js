'use strict';

angular
    .module('services.map')
    .factory('GeocodeMap', function GeocodeMapFactory(
        $log,
        $timeout,
        Google,
        GoogleGeocoder,
        EventDispatcher
    ) {
        var LONG_PRESS_DURATION = 1000;
        var MARKER_URL = 'http://d3e9bp48wqwk17.cloudfront.net/markers/marker-big.png';
        var GeocodeMap = {
            create: create,
            centerMapTo: centerMapTo,
            map: null,
            longPressCoordinates: null,
            clickTimer: null,
            marker: null
        };

        return GeocodeMap;

        function create (lat, lng) {
            $log.debug('[GEOCODE_MAP] Create');
            var latLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
            GeocodeMap.map = new Google.maps.Map(document.getElementById('modal-address-map'), {
                center: latLng,
                scrollwheel: false,
                disableDefaultUI: true,
                zoom: 15
            });
            Google.maps.event.addListener(GeocodeMap.map, 'mouseup', onMouseUp);
            Google.maps.event.addListener(GeocodeMap.map, 'drag', onDrag);
            Google.maps.event.addListener(GeocodeMap.map, 'mousedown', onMouseDown);
        }

        function onDrag () {
            $log.debug('[GEOCODE_MAP] on drag');
            deactivateMapPanLoading();
            $timeout.cancel(GeocodeMap.clickTimer);
        }

        function onMouseUp () {
            $log.debug('[GEOCODE_MAP] on mouse up');
            deactivateMapPanLoading();
            $timeout.cancel(GeocodeMap.clickTimer);
        }

        function onMouseDown (e) {
            $log.debug('[GEOCODE_MAP] on mouse down', e);
            activateMapPanLoading();
            GeocodeMap.longPressCoordinates = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            GeocodeMap.clickTimer = $timeout(function() {
                deactivateMapPanLoading();
                centerMapTo(GeocodeMap.longPressCoordinates.lat, GeocodeMap.longPressCoordinates.lng);
                GoogleGeocoder.reverseGeocode(GeocodeMap.longPressCoordinates.lat, GeocodeMap.longPressCoordinates.lng)
                    .then(function (addresses) {
                        if (addresses[0]) {
                            EventDispatcher.broadcast('geocodeMap.address', addresses[0]);
                        }
                    });
            }, LONG_PRESS_DURATION);
        }

        function addMarker (latLng) {
            var h = 100;
            var w = 80;
            var scale = 0.4;

            var image = {
                url: MARKER_URL,
                size: new Google.maps.Size(w, h),
                scaledSize: new Google.maps.Size(w * scale, h * scale),
                origin: new Google.maps.Point(0, 0),
                anchor: new Google.maps.Point(w * scale / 2, h * scale)
            };
            if (GeocodeMap.marker) {
                GeocodeMap.marker.setMap(null);
            }
            GeocodeMap.marker = new Google.maps.Marker({
                position: latLng,
                map: GeocodeMap.map,
                icon: image
            });
        }

        function centerMapTo (lat, lng) {
            GeocodeMap.map.panTo(new Google.maps.LatLng(lat, lng));
            addMarker({
                lat: lat,
                lng: lng
            });
        }

        function activateMapPanLoading () {
            angular.element(document.getElementsByClassName('map-pan-loading')).addClass('active');
        }

        function deactivateMapPanLoading () {
            angular.element(document.getElementsByClassName('map-pan-loading')).removeClass('active');
        }

    });
