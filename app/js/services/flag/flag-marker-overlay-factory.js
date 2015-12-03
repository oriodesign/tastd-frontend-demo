'use strict';

angular
    .module('services.flag')
    .factory('FlagMarkerOverlay', function FlagMarkerOverlayFactory(
        Google,
        AsGoogleOverlay
    ) {

        var FLAG_MARKER_TEMPLATE = '<div class="google-marker-wrap">' +
            '<div class="google-marker-overlay" ng-class="{\'icon icon-bookmark\' : !flag.position}"><span class="number">{{flag.position}}</span></div>' +
            '<i class="icon icon-marker" ng-style="::{\'color\': \'#\'+flag.color, \'-webkit-text-stroke-color\': \'#\'+borderColor}"></i>' +
            '</div>';

        function getModifiedComponent(color, modifier, elemNum){
            // extracts the elmentNum-th color component from an hex notation
            // computes the new color component applying the brightness modifier
            // and returns the corresponding hex string
            var component = parseInt(color.substr(elemNum*2, 2), 16);
            component = Math.min(Math.max((Math.round(component + (component*modifier))), 0), 255);
            var computed = component.toString(16);
            return (computed.length === 2)? computed : '0' + computed;
        }

        /**
         * computes a color with a increased or decreased brightness
         * does not work with black color ( #000000 )
         *
         * @param  {String} color hex color ('#' followed by 6 digits)
         * @param  {Number} modifier should be -1 <= modifier <= 1.
         *                           a negative modifier darken the color.
         * @return {String} computed hex color
         */
        function changeBrightness(color, modifier){
            var r = getModifiedComponent(color, modifier, 0),
                g = getModifiedComponent(color, modifier, 1),
                b = getModifiedComponent(color, modifier, 2);

            return r + g + b;
        }

        function FlagMarkerOverlay(flag, map) {

            this.$$flag = flag;

            AsGoogleOverlay.$constructor.call(this, {
                map : map,
                zIndex : (91 - parseFloat(flag.lat)) * 1000000,  // higher latitude stay under lower one
                offsetX: -13, // Marker width / 2
                offsetY: -30, // Marker height
                template : FLAG_MARKER_TEMPLATE,
                position : new Google.maps.LatLng(flag.lat, flag.lng),
                resolve  :  {
                    flag : flag,
                    borderColor : changeBrightness(flag.color, -0.2)
                }
            });
        }

        FlagMarkerOverlay.prototype = new Google.maps.OverlayView();
        AsGoogleOverlay.call(FlagMarkerOverlay.prototype);

        return FlagMarkerOverlay;
    });
