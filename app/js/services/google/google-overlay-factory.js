'use strict';

angular
    .module('services.google')
    .factory('GoogleOverlay', function GoogleOverlayFactory(
        Google,
        $rootScope,
        AsGoogleOverlay
    ) {

        /**
         * @see http://gmaps-samples-v3.googlecode.com/svn/trunk/overlayview/custommarker.html
         * @see http://nickjohnson.com/b/google-maps-v3-how-to-quickly-add-many-markers
         *
         * @name GoogleOverlay
         * @params markerOptions
         * @constructor
         */
        function GoogleOverlay(markerOptions) {
            AsGoogleOverlay.$constructor.call(this, markerOptions);
        }

        GoogleOverlay.prototype = new Google.maps.OverlayView();
        AsGoogleOverlay.call(GoogleOverlay.prototype);


        return GoogleOverlay;

    });

