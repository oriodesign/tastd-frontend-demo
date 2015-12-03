'use strict';

angular
    .module('services.flag')
    .factory('InfoboxOverlay', function InfoboxOverlayFactory(Google, AsGoogleOverlay) {

        var INFOBOX_TEMPLATE = ['<div class="infobox-resto clearfix">',
                               '<img ng-src="{{flag.picture}}" class="infobox-picture"/>',
                               '<div class="infobox-text">',
                               '<div class="infobox-name">{{flag.name | limitTo: 15}}{{flag.name.length > 20 ? \'..\' : \'\'}}</div>',
                               '<div class="infobox-cuisine" ng-style="{color:\'#\'+ flag.color}">{{flag.cuisineName}}</div>',
                               '</div>',
                               '</div>'].join('');

        function InfoboxOverlay(flag, map) {

            this.$$flag = flag;

            AsGoogleOverlay.$constructor.call(this, {
                zIndex: '100000000',
                map : map,
                offsetX: -46, // marker width / 2 + infoboxImage width
                offsetY: -78, // marker height (30) + infobox height
                template : INFOBOX_TEMPLATE,
                position : new Google.maps.LatLng(flag.lat, flag.lng),
                resolve  :  {
                    flag : flag
                }
            });
        }

        InfoboxOverlay.prototype = new Google.maps.OverlayView();
        AsGoogleOverlay.call(InfoboxOverlay.prototype);

        InfoboxOverlay.prototype.onClick = function (/* event */) {
        };

        return InfoboxOverlay;
    });
