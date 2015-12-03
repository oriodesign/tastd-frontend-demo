'use strict';

angular
    .module('entities.review')
    .factory('ReviewManager', function ReviewManagerFactory(
        Review,
        EntityManager,
        TagManager,
        $q,
        $log,
        Config,
        $http
    ) {

        var ReviewManager = _.extend(new EntityManager(Review), {
            getWallByUserId: getWallByUserId,
            getPublicWall: getPublicWall,
            transformForList: transformForList,
            findAllForList: findAllForList,
            loadMoreForList: loadMoreForList,
            changeCuisine: changeCuisine,
            updatePositionWithRanking: updatePositionWithRanking,
            persistOrder: persistOrder,
            replaceTagsWithGroupId: replaceTagsWithGroupId,
            updateReviewTagFields: updateReviewTagFields
        });

        return ReviewManager;

        function updateReviewTagFields (review) {
            review.bestFor = getTagsWithGroupId(review, TagManager.BEST_FOR);
            review.drinks = getTagsWithGroupId(review, TagManager.DRINKS);
            review.location = getTagsWithGroupId(review, TagManager.LOCATION);
            review.vibe = getTagsWithGroupId(review, TagManager.VIBE);
            review.entertainment = getTagsWithGroupId(review, TagManager.ENTERTAINMENT);
            review.specialMention = getTagsWithGroupId(review, TagManager.SPECIAL_MENTION);
            review.otherTags = getTagsWithGroupId(review, TagManager.OTHER);
        }

        function getTagsWithGroupId (review, id) {
            return _.filter(review.tags, function(t){
                return t.groupId === id;
            });
        }

        function replaceTagsWithGroupId (review, newTags, groupId) {
            $log.debug('[REVIEW_MANAGER] Replace tags with group id', review, newTags, groupId);
            var tags = _.filter(review.tags, function (t) {
                return t.groupId !== groupId;
            });
            tags = tags.concat(newTags);
            review.tags = tags;
        }

        function findAllForList(userId, geonameId, page) {
            var deferred = $q.defer();
            ReviewManager.findAll({
                user: userId,
                geoname: geonameId,
                orderBy: 'cuisine',
                page: page || 1
            }).then(function(reviews){
                var reviewsForList = ReviewManager.transformForList(reviews);
                deferred.resolve(reviewsForList);
            });

            return deferred.promise;
        }

        function loadMoreForList(userId, geonameId, reviews) {
            var deferred = $q.defer();
            ReviewManager.findAllForList(userId, geonameId, reviews.$metadata.nextPage)
                .then(function(newReviews){
                    reviews.$metadata = newReviews.$metadata;
                    _.each(newReviews, function(r){
                        reviews.push(r);
                    });
                    deferred.resolve(newReviews);
                });
            return deferred.promise;
        }

        function getWallByUserId(userId) {
            return Review.$search({
                user: userId,
                orderBy : 'created',
                serializationGroups : 'reviewOwner'
            }).$asPromise();
        }

        function getPublicWall () {
            return Review.$search({
                orderBy : 'created',
                serializationGroups : 'reviewOwner'
            }).$asPromise();
        }

        function transformForList(reviews){
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

        function changeCuisine(review, cuisine) {
            var deferred = $q.defer();
            var result = copyReview(review);
            var destroyPromise = review.$destroy().$asPromise();
            destroyPromise.then(function(){
                result.cuisine = cuisine;
                result.$save().$asPromise().then(function(review){
                    deferred.resolve(review);
                });
            });

            return deferred.promise;
        }

        function copyReview(review) {
            var result = Review.$build();
            result.restaurant = review.restaurant;
            result.comment = review.comment;
            result.picture = review.picture;
            result.cuisine = review.cuisine;
            result.name = review.name;
            result.cost = review.cost;
            result.geoname = review.geoname;
            result.taggedFriends = review.taggedFriends;
            result.tags = review.tags;
            result.position = null;

            return result;
        }

        function updatePositionWithRanking (review, ranking) {
            var newReview = _.findWhere(ranking, {id: review.id});
            review.position = newReview.position;
            $log.debug('[REVIEW_MANAGER] Set position = ' + newReview.position, review, newReview);

            return review;
        }

        function persistOrder(reviews) {
            // set the position property based on the order in the array
            reviews = _(reviews).each(function(v, k, obj) {
                obj[k].position = k+1;
            }).value();
            var payload = _.map(reviews, function(x) {
                return {
                    id: x.id,
                    position: x.position
                };
            });
            payload = {
                reviews: payload
            };
            return $http.post(Config.apiUrl()+'/reviews/reorder', payload);
        }

    });

