'use strict';

angular
    .module('services.flag')
    .factory('MeOverlay', function MeOverlayFactory(Google, AsGoogleOverlay) {

        var ME_MARKER_TEMPLATE = '<div class="google-marker-wrap"><div class="google-marker-overlay" ' +
            					 'ng-bind="flag.position"></div>' +
            '<svg class="marker-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" xml:space="preserve">' +
					             '<circle cx="13" cy="13" r="10" stroke="white" stroke-width="3px" fill="#4285F4" />' +
					             '</svg>' +
					             '</div>';

        function MeMarkerOverlay(coords, map) {

            AsGoogleOverlay.$constructor.call(this, {
                map : map,
                offsetX: -26,
                offsetY: -26,
                template : ME_MARKER_TEMPLATE,
                position : new Google.maps.LatLng(coords.lat, coords.lng),
                resolve  :  {
                    coords: coords
                }
            });
        }

        MeMarkerOverlay.prototype = new Google.maps.OverlayView();
        AsGoogleOverlay.call(MeMarkerOverlay.prototype);

        return MeMarkerOverlay;
    });

