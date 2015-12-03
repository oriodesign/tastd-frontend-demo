'use strict';

angular
    .module('services.map')
    .factory('MapService', function MapServiceFactory(
        $compile,
        $log,
        $state,
        Security,
        FlagManager,
        FlagMarkerOverlay,
        InfoboxOverlay,
        EventDispatcher,
        MeOverlay,
        Loader,
        UserGeolocation
    ) {
        var Google = window.google;
        var bounds = {};

        var removePointOfInterests = [
            {
              'featureType': 'poi',
              'elementType': 'labels',
              'stylers': [
                { 'visibility': 'off' }
              ]
            }
          ];

        var mapOptions = {
            zoom: 12, // default 12
            mapTypeId: Google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
            disableDefaultUI: true,
            disableDoubleClickZoom: false,
            styles: removePointOfInterests
        };

        var MapService = {
            map  : null,
            flags : [],
            myMarker : null,
            openInfobox : null,
            markers : [],
            coordinates : {
                lat: 0,
                lng: 0
            },
            currentZoom : mapOptions.zoom,
            clickOnMarker: false,
            createMap: createMap,
            createLatLng: createLatLng,
            panTo: panTo,
            setZoom: setZoom,
            setMarkersMap: setMarkersMap,
            deleteMarkers: deleteMarkers,
            closeInfoBox: closeInfoBox,
            addFlagMarker: addFlagMarker,
            centerOnGeoname: centerOnGeoname,
            setMyCoordinates: setMyCoordinates,
            searchAndReplaceFlags: searchAndReplaceFlags,
            setFlags: setFlags,
            refreshRendering: refreshRendering
        };

        return MapService;


        function createMap(coordinates) {
            if (MapService.map) {
                $log.debug('[MAP_SERVICE] Try to create map, but it exists so panTo and zoom', coordinates);
                delayedSetCenter(coordinates);

                return MapService.map;
            }

            var options = angular.extend({}, mapOptions, {
                center: coordinates,
                zoom : MapService.currentZoom
            });
            $log.debug('[MAP_SERVICE] Create map', options);
            MapService.map = new Google.maps.Map(document.getElementById('map'),options);

            Google.maps.event.addListener(MapService.map, 'zoom_changed', function() {
                MapService.currentZoom = MapService.map.getZoom();
            });

            Google.maps.event.addListener(MapService.map, 'bounds_changed', _.debounce(function(){
                MapService.map.getBounds();
                var ne = MapService.map.getBounds().getNorthEast(),
                    sw = MapService.map.getBounds().getSouthWest();
                bounds = {
                    minLat : sw.lat(),
                    minLng : sw.lng(),
                    maxLat : ne.lat(),
                    maxLng : ne.lng()
                };
                EventDispatcher.broadcast('map.bounds', bounds);
            }, 800));

            Google.maps.event.addListener(MapService.map, 'click', function() {
                if (!MapService.clickOnMarker) {
                    MapService.closeInfoBox();
                }
            });

            return MapService.map;
        }

        function createLatLng(lat, lng) {
            return new Google.maps.LatLng(lat,lng);
        }

        function panTo(coordinates) {
            $log.debug('[MAP_SERVICE] Pan to lat lng', coordinates );
            if (MapService.map) {
                MapService.map.panTo(coordinates);
            }
        }

        function setZoom(zoom) {
            $log.debug('[MAP_SERVICE] set zoom');
            MapService.map.setZoom(zoom || mapOptions.zoom);
        }

        function setMarkersMap(map) {
            for (var i = 0; i < MapService.markers.length; i++) {
                MapService.markers[i].setMap(map);
            }
        }

        function deleteMarkers() {
            MapService.setMarkersMap(null);
            MapService.markers = [];
            return MapService;
        }

        function closeInfoBox() {
            $log.debug('[MAP_SERVICE] Close infobox');
            return MapService.openInfobox && MapService.openInfobox.setMap(null);
        }

        function addFlagMarker(flag) {
            $log.debug('[MAP_SERVICE] Add flag marker');
            var marker = new FlagMarkerOverlay(flag, MapService.map);

            // attach click events to markers and infoboxes
            Google.maps.event.addListener(marker, 'click', function() {
                // Disable the closeInfobox event on the map
                // This is a workaround because evt.stopPropagation doesn't work
                MapService.clickOnMarker = true;
                setTimeout(function(){
                    MapService.clickOnMarker = false;
                },300);
                MapService.closeInfoBox();
                MapService.openInfobox = new InfoboxOverlay(flag, MapService.map);
                Google.maps.event.addListener(MapService.openInfobox, 'click', function() {
                    var params = {
                        restaurantId: flag.restaurantId
                    };
                    $state.go('restaurantView', params);
                });
            });

            MapService.markers.push(marker);
            return MapService;
        }

        function centerOnGeoname(geoname) {
            $log.debug('[MAP_SERVICE] Center on geoname => Pan to');
            MapService.coordinates =  new Google.maps.LatLng(
                parseFloat(geoname.lat), parseFloat(geoname.lng)
            );
            panTo(MapService.coordinates);
        }

        function searchAndReplaceFlags() {
            $log.debug('[MAP_SERVICE] Search and replace flags');
            deleteMarkers();
            angular.forEach(MapService.flags, function (flag) {
                addFlagMarker(flag);
            });
        }

        function setFlags(flags) {
            $log.debug('[MAP_SERVICE] Set flags');
            MapService.flags = flags;
            searchAndReplaceFlags();
        }

        function setMyCoordinates(coordinates) {
            MapService.coordinates =  MapService.createLatLng(coordinates.lat, coordinates.lng);

            if(MapService.myMarker) {
                MapService.myMarker.setMap(null);
            }

            MapService.myMarker = new MeOverlay(coordinates, MapService.map);
            setZoom(14);
            panTo(coordinates);
        }

        function refreshRendering () {
            $log.debug('[MAP_SERVICE] Refresh rendering');
            Google.maps.event.trigger(MapService.map, 'resize');
            MapService.map.setZoom( MapService.map.getZoom() );
        }

        function delayedSetCenter (coordinates) {
            setTimeout(function(){
                $log.debug('[MAP_SERVICE] Delayed set center');
                MapService.map.panTo(new Google.maps.LatLng(coordinates.lat,coordinates.lng));
                setZoom(12);
            },100);
        }

    });
