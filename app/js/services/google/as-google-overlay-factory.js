'use strict';

angular
    .module('services.google')
    .factory('AsGoogleOverlay', function AsGoogleOverlayFactory(
        Google,
        $rootScope,
        $compile
    ) {

        var AsGoogleOverlay = function () {

            this.draw = function() {
                var self = this;
                var div = this.div_;
                var point;
                var panes;
                var compiled;

                // Check if the div has been already created.
                if (!div) {

                    // Create a overlay text DIV
                    div = this.div_ = document.createElement('DIV');

                    // Create the DIV representing our CustomMarker
                    div.style.border = 'none';
                    div.style.position = 'absolute';
                    div.style.paddingLeft = '0px';
                    div.style.cursor = 'pointer';
                    div.style.zIndex = this.$$options.zIndex || 1;

                    compiled = $compile(this.$$options.template)(this.$$options.$scope);
                    if(!this.$$options.$scope.$$phase && !$rootScope.$$phase) {
                        this.$$options.$scope.$apply();
                    }
                    div.appendChild(compiled[0]);

                    Google.maps.event.addDomListener(div, 'click', function(evt) {
                        Google.maps.event.trigger(self, 'click', evt);
                    });

                    // Then add the overlay to the DOM
                    panes = this.getPanes();
                    panes.overlayImage.appendChild(div);
                }

                // Position the overlay
                point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

                var offsetX = this.$$options.offsetX || 0;
                var offsetY = this.$$options.offsetY || 0;

                if (point) {
                    div.style.left = (offsetX + point.x) + 'px';
                    div.style.top = (offsetY + point.y) + 'px';
                }
            };

            this.remove = function() {
                // Check if the overlay was on the map and needs to be removed.
                if (this.div_) {
                    this.div_.parentNode.removeChild(this.div_);
                    this.div_ = null;
                }

                if(this.$$options && this.$$options.$scope) {
                    this.$$options.$scope.$destroy();
                }
            };

            this.getPosition = function() {
                return this.latlng_;
            };

            this.panTo = function () {
                this.getMap().panTo(this.getPosition());
            };

            return this;
        };




        AsGoogleOverlay.$constructor = function (markerOptions) {

            markerOptions = markerOptions || {};

            this.$$options = angular.extend({
                position: new Google.maps.LatLng(0, 0),
                map: null,
                title : null,
                $scope : markerOptions.$scope || $rootScope.$new(true),
                resolve : {},
                template : '<span class="google-marker-overlay">{{ title }}</span>'
            }, markerOptions);


            // set title to scope
            this.$$options.$scope.$title = this.$$options.title;

            // extend scope with resolve object
            angular.extend(this.$$options.$scope, this.$$options.resolve);

            // crucial
            this.latlng_ = this.$$options.position;

            // Once the LatLng and text are set, add the overlay to the map.  This will
            // trigger a call to panes_changed which should in turn call draw.
            this.setMap(this.$$options.map);
        };

        return AsGoogleOverlay;
    });

