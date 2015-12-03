'use strict';

angular
    .module('states.map', [
        'services.google',
        'directives.map',
        'services.map',
        'services.utility'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('map', {
                url : '/map',
                parent : 'private',
                templateUrl : 'js/states/map/map.html',
                controller : 'MapCtrl as ctrl',
                resolve: {
                    flagParametersBag: function (FlagParametersBagFactory, me) {
                        var flagParametersBag = FlagParametersBagFactory.createWithLastGeoname();
                        flagParametersBag.leadersOf = me.id;

                        return flagParametersBag;
                    }
                },
                layout: {
                    'navbar-geo-guru': true,
                    'navbar-page-title': false,
                    'navbar-map-button': true,
                    'main-menu-restaurants': true
                }
            });

        $stateProvider.state('rankingList', {
            url: '/user/:userId/rankings/list/:cityName/:cityId/:userFirstName/:userLastName/:userFullName/:lat/:lng',
            parent: 'private',
            templateUrl: 'js/states/map/map.html',
            controller: 'MapCtrl as ctrl',
            resolve: {
                geonameParameter: function (GeonameManager, $stateParams) {
                    return GeonameManager.createFromStateParams($stateParams);
                },
                userParameter: function (UserManager, $stateParams) {
                    return UserManager.createFromStateParams($stateParams);
                },
                flagParametersBag: function (
                    FlagParametersBagFactory,
                    geonameParameter,
                    userParameter
                ) {
                    return FlagParametersBagFactory
                        .createFromUserAndGeoname(userParameter, geonameParameter);
                }
            },
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-ranking-title': true,
                'navbar-back-button': true,
                'navbar-page-title': false,
                'navbar-map-button': true
            }
        });

    });
