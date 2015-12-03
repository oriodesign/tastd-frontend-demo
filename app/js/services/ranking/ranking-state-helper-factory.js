'use strict';

angular
    .module('services.ranking')
    .factory('RankingStateHelper', function RankingStateHelperFactory(
            Review,
            $http,
            Config,
            $q,
            Cuisine,
            CuisineManager,
            GeonameManager
        ) {

        var RankingStateHelper = {
            ranking: Review.$collection(),
            loadRanking: loadRanking,
            loadMoreRanking: loadMoreRanking,
            unsavedReview: null,
            pushUnsavedReview: pushUnsavedReview,
            popUnsavedReview: popUnsavedReview,
            loadRankingForMapList: loadRankingForMapList,
            fetchMoreRankingForMapList: fetchMoreRankingForMapList
        };

        return RankingStateHelper;

        function getCriteria($stateParams){
            return {
                user: $stateParams.userId,
                geoname: $stateParams.cityId,
                orderBy: $stateParams.orderBy,
                cuisine: $stateParams.cuisineId
            };
        }

        function loadRanking(criteria) {
            return RankingStateHelper.ranking
                .$refresh(criteria)
                .$then(function(ranking) {
                    // is it a new (i.e. empty ranking)? Note the corresponding
                    // code in the controller
                    if (!ranking) {
                        ranking = [];
                    }
                    var promCuisine = CuisineManager.findOneById(criteria.cuisine)
                        .then(function(cuisine) {
                            ranking.cuisine = cuisine;
                        });
                    var promGeoname = GeonameManager.findRestmodResource(criteria.geoname)
                        .$asPromise().then(function(g) {
                        ranking.geoname = g;
                    });
                    ranking.sort(function(a,b) {return a.position - b.position;});
                    ranking.userId = criteria.user;

                    return $q.all([promCuisine, promGeoname]).then(function(){
                        return ranking;
                    });
                }).$asPromise();
        }

        function loadMoreRanking(parameters){
            return RankingStateHelper.ranking.$fetchMore(parameters).$asPromise();
        }

        function pushUnsavedReview(r) {
            RankingStateHelper.unsavedReview = r;
        }

        function popUnsavedReview() {
            var defer = $q.defer();
            defer.resolve(angular.copy(RankingStateHelper.unsavedReview));
            return defer.promise.then(function(r) {
                RankingStateHelper.unsavedReview = null;
                return r;
            });
        }

        function buildForMapList(reviews){
            _.forEach(reviews, function(item) {
                    item.restaurantId = item.restaurant.id;
                    item.name = item.restaurant.name;
                    item.picture = item.restaurant.picture;
                    item.color = item.cuisine.color;
                    item.cuisineName = item.cuisine.name;
                    item.cuisineId = item.cuisine.id;
                });
            return reviews;
        }

        function extractParams($stateParams){
            return angular.extend({}, $stateParams, {
                orderBy : 'cuisine'
            });
        }

        function loadRankingForMapList($stateParams) {
            return RankingStateHelper.loadRanking(extractParams($stateParams))
                .then(function(reviews){
                    // mapping for maplist
                    buildForMapList(reviews);
                    return reviews;
                });
        }

        function fetchMoreRankingForMapList(list, $stateParams) {
            return list.$fetchMore(extractParams({
                    user: $stateParams.userId,
                    geoname: $stateParams.cityId
                }))
                .$asPromise().then(function(items) {
                    buildForMapList(items);
                    return items;
                });
        }
    });
