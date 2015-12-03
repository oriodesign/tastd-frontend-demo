'use strict';

angular
    .module('states.private', [
        'directives.map',
        'services.share',
        'services.security',
        'services.analytics',
        'services.notification',
        'states.map',
        'states.restaurant',
        'states.invite',
        'states.notification',
        'states.ranking',
        'states.settings',
        'states.onBoarding',
        'states.user',
        'states.wall'
    ])
    .config(function (
        $stateProvider,
        SecurityProvider
    ) {
        $stateProvider.state('private', {
            url : '/app',
            abstract: true,
            templateUrl: 'js/states/private/private.html',
            controller: function(
                $scope,
                $state,
                $log,
                NotificationBadge,
                me,
                PushMessageManager,
                ShareService,
                MyWishedHelper,
                MyReviewedHelper,
                MyLeadersHelper,
                OptionManager,
                LayoutManager,
                $translate,
                GeoGuruModal
            ) {
                $scope.navBack = {
                    onClick : null
                };
                $scope.layoutManager = LayoutManager;
                $scope.notificationBadge = NotificationBadge;
                $scope.flagParametersBag = null;
                $scope.mapMode = false;
                $scope.changeGeoGuru = changeGeoGuru;
                $scope.share = share;
                $scope.done = done;
                $scope.edit = edit;
                $scope.map = map;
                $scope.centerOnMe = centerOnMe;
                $scope.mapIsLoading = false;

                initialize();

                function initialize() {
                    updateCacheHelper();
                    updatePushMessageCounter();
                    updateLanguageSettings();
                }

                function centerOnMe () {
                    $scope.$broadcast('navbar.centerOnMe');
                }

                function changeGeoGuru () {
                    $log.debug('[CONTROLLER_PRIVATE] Change Geo Guru');
                    GeoGuruModal.create()
                        .then(function(response){
                            $log.debug('[CONTROLLER_PRIVATE] Geo guru result', response);
                            $scope.flagParametersBag.updateWithGeoGuruResponse(response);
                            $scope.$broadcast('navbar.changeGeoGuru', response);
                        });
                }

                function map () {
                    $scope.mapMode = !$scope.mapMode;
                    $scope.$broadcast('navbar.mapMode', {
                        mapMode: $scope.mapMode
                    });
                }

                function done () {
                    $scope.$broadcast('navbar.done');
                }

                function edit () {
                    $scope.$broadcast('navbar.edit');
                }

                function share () {
                    ShareService.share();
                }

                function updateCacheHelper () {
                    MyWishedHelper.refresh();
                    MyReviewedHelper.refresh();
                    MyLeadersHelper.refresh();
                }

                function updatePushMessageCounter () {
                    PushMessageManager.getUnseenCounter(me.id).then(function(response){
                        NotificationBadge.counter = response.data.counter;
                    });
                }

                function updateLanguageSettings () {
                    var languagePromise = OptionManager.get('language');
                    languagePromise.then(function(language){
                        if (language) {
                            setLocale(language.id);
                        }

                        function setLocale(key){
                            $translate.use(key);
                        }
                    });
                }

            },
            resolve :  {
                me: SecurityProvider.resolvers.me
            }
        });
    });
