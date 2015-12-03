'use strict';

angular
    .module('services.flag')
    .factory('FlagParametersBagFactory', function FlagParametersBagFactoryFactory (
        $translate,
        PriceManager,
        Security,
        SimpleLocalStorage,
        UserGeolocation,
        $q
    ) {

        var MIN_COST = 0;
        var MAX_COST = 200;

        var FlagParametersBagFactory = {
            create: create,
            createFromUserAndGeoname: createFromUserAndGeoname,
            createWithLastGeoname: createWithLastGeoname
        };

        return FlagParametersBagFactory;

        function createWithLastGeoname () {
            var flagParametersBag = FlagParametersBagFactory.create();
            var deferred = $q.defer();

            var lastGeoname = SimpleLocalStorage.getObject('lastGeoname');
            if (lastGeoname) {
                lastGeoname.lat = parseFloat(lastGeoname.lat);
                lastGeoname.lng = parseFloat(lastGeoname.lng);
                flagParametersBag.geoname = lastGeoname;
                deferred.resolve(lastGeoname);
                flagParametersBag.geonamePromise = deferred.promise;
            } else {
                flagParametersBag.geonamePromise = UserGeolocation.getCurrentGeoname();
                flagParametersBag.geonamePromise.then(function(geoname){
                    flagParametersBag.geoname = geoname;
                });
            }

            return flagParametersBag;
        }

        function createFromUserAndGeoname (user, geoname) {
            var deferred = $q.defer();
            deferred.resolve(geoname);
            var flagParametersBag = FlagParametersBagFactory.create();
            flagParametersBag.geoname = geoname;
            flagParametersBag.users = [user];
            flagParametersBag.geonamePromise = deferred.promise;

            if (parseInt(Security.user.id) === parseInt(user.id)) {
                flagParametersBag.withWish = true;
            }

            return flagParametersBag;
        }

        function create () {
            var FlagParametersBag = {
                users: [],
                tags: [],
                cuisines: [],
                geoname: null,
                geonamePromise: null,
                minLat: null,
                maxLat: null,
                minLng: null,
                maxLng: null,
                leadersOf: null,
                minCost: null,
                maxCost: null,
                wishedBy: null,
                reviewedBy: null,
                wish: false,
                withWish: false,
                orderBy: 'cuisine',
                isDirty: isDirty,
                getGeoGuruLabel: getGeoGuruLabel,
                getFiltersLabel: getFiltersLabel,
                getQueryParameters: getQueryParameters,
                getGeonameTitle: getGeonameTitle,
                getGuruTitle: getGuruTitle,
                updateWithGeoGuruResponse: updateWithGeoGuruResponse,
                updateWithBoundsResponse: updateWithBoundsResponse,
                updateWithFiltersResponse: updateWithFiltersResponse,
                resetBounds: resetBounds
            };

            return FlagParametersBag;

            function getQueryParameters () {
                var queryParameters = {};

                _.each(['leadersOf', 'wishedBy', 'reviewedBy', 'minLat',
                    'maxLat', 'minLng', 'maxLng', 'withWish', 'orderBy'], function (property) {
                    updateProperty(queryParameters, property);
                });

                _.each(['cuisines', 'users', 'tags'], function (property) {
                    updateArrayProperty(queryParameters, property);
                });

                // Geoname
                queryParameters.geoname = (FlagParametersBag.geoname || {id: 5128581}).id;

                // MinCost
                if (FlagParametersBag.minCost && FlagParametersBag.minCost !== MIN_COST) {
                    queryParameters.minCost = FlagParametersBag.minCost;
                }

                // MaxCost
                if (FlagParametersBag.maxCost && FlagParametersBag.maxCost !== MAX_COST) {
                        queryParameters.maxCost = FlagParametersBag.maxCost;
                }

                return queryParameters;
            }

            function getGeoGuruLabel () {
                if (!FlagParametersBag.geoname) {
                    return '';
                }

                if (FlagParametersBag.users.length === 0) {
                    return FlagParametersBag.geoname.asciiName + ', '
                        + $translate.instant('user.all_gurus');
                }

                return FlagParametersBag.geoname.asciiName + ', '
                    + FlagParametersBag.users[0].fullName;
            }

            function getFiltersLabel () {
                var filterLabels = [];

                // CUISINES
                _.each(FlagParametersBag.cuisines, function (cuisine) {
                    filterLabels.push(cuisine.name);
                });

                // MIN COST
                if (FlagParametersBag.minCost && FlagParametersBag.minCost !== MIN_COST) {
                    filterLabels.push(
                        '<' + PriceManager.getSliderLabel(
                            FlagParametersBag.minCost,
                            FlagParametersBag.geoname)
                    );
                }

                // MAX COST
                if (FlagParametersBag.maxCost && FlagParametersBag.maxCost !== MAX_COST) {
                    filterLabels.push(
                        '<' + PriceManager.getSliderLabel(
                            FlagParametersBag.maxCost,
                            FlagParametersBag.geoname)
                    );
                }

                // TAGS
                _.each(FlagParametersBag.tags, function (tag) {
                    filterLabels.push(tag.name);
                });

                return filterLabels.join(', ');
            }

            function isDirty () {
                if (FlagParametersBag.cuisines.length > 0 || FlagParametersBag.tags.length > 0) {
                    return true;
                }
                if (FlagParametersBag.minCost && FlagParametersBag.minCost !== MIN_COST) {
                    return true;
                }
                return FlagParametersBag.maxCost && FlagParametersBag.maxCost !== MAX_COST;
            }

            function getGuruTitle () {
                var usersParameter = _.map(FlagParametersBag.users, function (user) {
                    return user.firstName;
                });
                return usersParameter.join(',');
            }

            function getGeonameTitle () {
                if (!FlagParametersBag.geoname) {
                    return '';
                }

                return FlagParametersBag.geoname.asciiName;
            }

            function updateWithGeoGuruResponse (response) {
                FlagParametersBag.geoname = response.geoname;
                if (response.guru) {
                    FlagParametersBag.users = [response.guru];
                    FlagParametersBag.leadersOf = null;
                } else {
                    FlagParametersBag.leadersOf = Security.user.id;
                    FlagParametersBag.users = [];
                }
            }

            function updateWithBoundsResponse (bounds) {
                FlagParametersBag.minLat = bounds.minLat;
                FlagParametersBag.maxLat = bounds.maxLat;
                FlagParametersBag.minLng = bounds.minLng;
                FlagParametersBag.maxLng = bounds.maxLng;
            }

            function resetBounds () {
                FlagParametersBag.minLat = null;
                FlagParametersBag.maxLat = null;
                FlagParametersBag.minLng = null;
                FlagParametersBag.maxLng = null;
            }

            function updateWithFiltersResponse (response) {
                FlagParametersBag.cuisines = response.cuisines;
                FlagParametersBag.tags = response.tags;
                FlagParametersBag.maxCost = response.maxCost;
                FlagParametersBag.minCost = response.minCost;
            }

            function updateProperty (queryParameters, param) {
                if (FlagParametersBag[param]) {
                    queryParameters[param] = FlagParametersBag[param];
                }
            }

            function updateArrayProperty (queryParameters, param) {
                if (FlagParametersBag[param].length > 0) {
                    var arrayParameter = _.map(FlagParametersBag[param], function (object) {
                        return object.id;
                    });
                    queryParameters[param] = arrayParameter.join(',');
                }
            }

        }

    });
