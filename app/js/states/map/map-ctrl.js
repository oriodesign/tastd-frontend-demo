'use strict';

angular
    .module('states.map')
    .controller('MapCtrl', function (
        $scope,
        $state,
        $stateParams,
        FlagManager,
        me,
        $rootScope,
        $log,
        FiltersModal,
        flagParametersBag,
        MapService,
        UserGeolocation,
        Loader,
        $ionicScrollDelegate,
        Analytics
    ) {

        $log.debug('[CONTROLLER] Start MapCtrl');
        var ctrl = this;
        ctrl.flags = [];
        ctrl.entered = false;
        ctrl.loading = false;
        ctrl.mapMode = false;
        ctrl.isReordable = true;
        ctrl.page = $state.current.name;
        ctrl.flagParametersBag = flagParametersBag;
        ctrl.doRefresh = doRefresh;
        ctrl.loadMoreItems = loadMoreItems;
        ctrl.openFiltersModal = openFiltersModal;
        ctrl.toggleWishFilter = toggleWishFilter;
        ctrl.toggleReviewFilter = toggleReviewFilter;
        ctrl.noResultMessageIsFilter = noResultMessageIsFilter;
        ctrl.isMe = isMe;

        initialize();

        function initialize () {
            loadFlags();
            $scope.$on("$destroy", onDestroy);
            $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
            $scope.$on('$ionicView.afterEnter', onAfterEnter);
            $scope.$on('$ionicView.beforeLeave', onBeforeLeave);
            $scope.$on('navbar.changeGeoGuru', onChangeGeoGuru);
            $scope.$on('navbar.mapMode', onNavbarMap);
            $scope.$on('navbar.centerOnMe', onCenterOnMe);
            $scope.$on('map.bounds', onMapBounds);
        }

        function isMe () {
            if (ctrl.flagParametersBag.users.length !== 1) {
                return false;
            }
            if (typeof ctrl.flagParametersBag.users[0] === 'undefined') {
                return false;
            }

            return parseInt(ctrl.flagParametersBag.users[0].id) === parseInt(me.id);
        }

        function onBeforeEnter () {
            $log.debug('[CONTROLLER] Entered');
            $scope.$parent.flagParametersBag = flagParametersBag;
            $scope.$parent.mapMode = ctrl.mapMode;
            initializeMap();
        }

        function onAfterEnter () {
            $log.debug('[CONTROLLER] On after enter');
            ctrl.entered = true;
            ctrl.mapMode ? showGlobalMap() : hideGlobalMap();

        }

        function onNavbarMap (event, parameters) {
            $log.debug('[CONTROLLER] On Map mode', parameters);
            parameters.mapMode ? activateMap() : deactivateMap();
        }

        function deactivateMap () {
            $log.debug('[CONTROLLER] Deactivate map');
            ctrl.mapMode = false;
            flagParametersBag.resetBounds();
            hideGlobalMap();
            loadFlags();
        }

        function activateMap () {
            $log.debug('[CONTROLLER] Activate map');
            Analytics.trackEvent($state.current.name, 'activate_map_view');
            ctrl.mapMode = true;
            showGlobalMap();
            initializeMap();
            setTimeout(function () {
                MapService.refreshRendering();
            }, 0);
        }

        function onMapBounds (event, bounds) {
            if (ctrl.mapMode) {
                flagParametersBag.updateWithBoundsResponse(bounds);
                loadFlags();
            }
        }

        function onChangeGeoGuru (event, result) {
            $log.debug('[CONTROLLER] On change geo guru');
            MapService.centerOnGeoname(flagParametersBag.geoname);
            if (result.guru) {
                Analytics.trackEvent('map', 'single_guru');
            } else {
                Analytics.trackEvent('map', 'all_gurus');
            }

            loadFlags();
        }

        function onBeforeLeave () {
            ctrl.entered = false;
            hideGlobalMap();
        }

        function doRefresh () {
            FlagManager.findAll(flagParametersBag.getQueryParameters())
                .then(function(flags){
                    ctrl.flags = flags;
                }).finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function onDestroy () {
            $log.debug('[CONTROLLER] On $destroy');
        }

        function loadMoreItems () {
            ctrl.flags.$fetchMore().$asPromise().then(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        function loadFlags(){
            $log.debug('[CONTROLLER] Start load Flags');
            ctrl.loading = true;
            $scope.$parent.mapIsLoading = true;
            if (!ctrl.mapMode) {
                $ionicScrollDelegate.scrollTop();
                ctrl.flags.length = 0;
            }
            return FlagManager.findAll(flagParametersBag.getQueryParameters())
                .then(onLoadFlags);
        }

        function onLoadFlags (flags) {
            $log.debug('[CONTROLLER] Finish load Flags');
            if (ctrl.mapMode) {
                MapService.setFlags(flags);
            } else {
                ctrl.flags = flags;
            }
            ctrl.loading = false;
            $scope.$parent.mapIsLoading = false;
            ctrl.isReordable = isMe();
        }

        function openFiltersModal () {
            $log.debug('[MAP_LIST_CONTROLLER] Open filters Modal');
            return FiltersModal.create(flagParametersBag)
                .then(function(response){
                    $log.debug('[MAP_LIST_CONTROLLER] Filter Modal results', response);
                    Analytics.trackFilters($state.current.name, response, 0, 300);
                    flagParametersBag.updateWithFiltersResponse(response);
                    loadFlags();
                });
        }

        function toggleWishFilter () {
            $log.debug('[MAP_LIST_CONTROLLER] Toggle wishedBy filter');
            flagParametersBag.wishedBy = flagParametersBag.wishedBy ? undefined : me.id;
            loadFlags();
            if (flagParametersBag.wishedBy) {
                Analytics.trackEvent($state.current.name, 'activate_wished_by_me_filter');
            }
        }

        function toggleReviewFilter () {
            $log.debug('[MAP_LIST_CONTROLLER] Toggle reviewedBy filter');
            flagParametersBag.reviewedBy = flagParametersBag.reviewedBy ? undefined : me.id;
            loadFlags();
            if (flagParametersBag.reviewedBy) {
                Analytics.trackEvent($state.current.name, 'activate_reviewed_by_me_filter');
            }
        }


        // MAP

        function initializeMap () {
            $log.debug('[MAP_LIST_CONTROLLER] Initialize map');
            if (flagParametersBag.geoname) {
                onGeonameLoad(flagParametersBag.geoname);
            } else {
                flagParametersBag.geonamePromise.then(onGeonameLoad);
            }
        }

        function onGeonameLoad (geoname) {
            $log.debug('[MAP_LIST_CONTROLLER] Initialize map (On geoname load)');
            var coordinates = {
                lat: parseFloat(geoname.lat),
                lng: parseFloat(geoname.lng)
            };
            MapService.createMap(coordinates);
        }

        function onCenterOnMe () {
            $log.debug('[MAP_LIST_CONTROLLER] Center on me');
            Loader.track(UserGeolocation.getCurrentPosition()
                .then(function(coordinates){
                    MapService.setMyCoordinates(coordinates);
                }));
        }

        function showGlobalMap () {
            angular.element(document.getElementsByClassName('map-global-wrapper')).addClass('active');
        }

        function hideGlobalMap () {
            angular.element(document.getElementsByClassName('map-global-wrapper')).removeClass('active');
        }

        function noResultMessageIsFilter () {
            return ctrl.flagParametersBag.isDirty()
                || ctrl.flagParametersBag.reviewedBy
                || ctrl.flagParametersBag.wishedBy;
        }


    });

