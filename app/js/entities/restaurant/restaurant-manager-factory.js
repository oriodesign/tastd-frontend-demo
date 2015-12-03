'use strict';

angular
    .module('entities.restaurant')
    .factory('RestaurantManager', function RestaurantManagerFactory (
        Restaurant,
        EntityManager,
        $http,
        Config,
        Geoname,
        Base64Util,
        $q
    ) {
        var RestaurantManager = _.extend(new EntityManager(Restaurant), {
            buildFromPlace: buildFromPlace,
            buildFromPlaceId: buildFromPlaceId,
            findTopRestaurants: findTopRestaurants,
            findNearLocation: findNearLocation,
            findByName: findByName
        });

        return RestaurantManager;

        function findByName (name, geonameId) {
            name.replace('\'', '%27');
            return RestaurantManager.findAll({
                name: name,
                geoname: geonameId,
                orderBy: 'score'
            });
        }

        function findTopRestaurants (geonameId) {
            return RestaurantManager.findAll({
                orderBy: 'score',
                geoname: geonameId
            });
        }

        function findNearLocation (lat, lng, name) {
            var params = {
                orderBy: 'distance',
                lat: lat,
                lng: lng,
                maxDistance: 1
            };

            if (name && name.trim() !== '') {
                params.name = name;
            }

            return RestaurantManager.findAll(params);
        }

        function buildFromPlaceId (placeId) {
            var deferred = $q.defer();
            var url = Config.apiUrl('/google-places/place-results/' + placeId);
            $http.get(url).then(function(response) {
                var placeResultData = response.data.placeResult;
                var restaurant = RestaurantManager.buildFromPlace(placeResultData);
                if (!placeResultData.picture) {
                    return deferred.resolve(restaurant);
                }

                return $http.get(placeResultData.picture, {responseType: 'arraybuffer'})
                    .then(function(response) {
                        restaurant.uploadedPicture = Base64Util.base64ArrayBuffer(response.data);
                        deferred.resolve(restaurant);
                    });
            });

            return deferred.promise;
        }

        function buildFromPlace (place) {
            return Restaurant.$build({
                name    : place.name,
                picture : place.picture,
                address : place.formattedAddress,
                lat     : place.latitude,
                lng     : place.longitude,
                geoname : Geoname.$build(place.geoname),
                website : place.website,
                phone   : place.telephone,
                placeId : place.id
            });
        }
    });
