'use strict';

angular
    .module('services.utility')
    .factory('MapDistance', function MapDistanceFactory() {

        function toRadians(value){
            return value * Math.PI / 180;
        }

        function getDistance(pos1, pos2) {
            var φ1 = toRadians(pos1.lat),
                φ2 = toRadians(pos2.lat),
                λ1 = toRadians(pos1.lng),
                λ2 = toRadians(pos2.lng),
                R = 6371000;

            // http://www.movable-type.co.uk/scripts/latlong.html
            // equirectangular approximation
            var x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
            var y = (φ2-φ1);
            var d = Math.sqrt(x*x + y*y) * R;

            return d;
        }

        function roundTo(value, segment) {
            return Math.ceil(value / segment) * segment;
        }

        function approximate(value) {
            if (value < 1000) {
                return roundTo(value, 50);
            }
            if (value < 10*1000) {
                return roundTo(value, 100);
            }
            if (value >= 10*1000) {
                return roundTo(value, 1000);
            }
        }

        function getFormattedDistance(pos1, pos2) {
            var approx = approximate(getDistance(pos1, pos2));

            return (approx > 1000)?
                    ((approx/1000) + ' km') :
                    (approx + ' m');
        }

        return {
            getDistance : getDistance,
            getFormattedDistance : getFormattedDistance
        };
    });

