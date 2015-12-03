'use strict';

angular
    .module('directives.map')
    .directive('staticMap', function StaticMapDirective() {
        //maps.googleapis.com/maps/api/staticmap?size=640x200&zoom=14&markers=color:red|label:X|61.133789,10.401121
        var BASE_URL = 'https://maps.googleapis.com/maps/api/staticmap?';
        var ZOOM_DEFAULT_LEVEL = 14;
        // USE CORRECT MARKER IMAGE URL
        var MARKER_URL = encodeURIComponent('http://goo.gl/caV6hq');

        return {
            restrict : 'EA',
            replace : true,
            template : '<img alt="Google Map">',
            controller : function () {

            },
            link : function(scope, element, attrs){
                function buildAddress(){
                    return BASE_URL +
                            'size=' + encodeURIComponent(attrs.size) +
                            '&zoom=' + ZOOM_DEFAULT_LEVEL +
                            '&markers=color:' + '0x' + attrs.color +
                            '&markers=icon:' + MARKER_URL +
                            '|' + encodeURIComponent(attrs.lat) +
                            ',' + encodeURIComponent(attrs.lng);
                }

                var el = element[0];
                var size = attrs.size.split('x');
                el.width = parseInt(size[0], 10);
                el.height = parseInt(size[1], 10);
                el.src = buildAddress();
            }
        };
    });
