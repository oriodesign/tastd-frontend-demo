'use strict';

angular
    .module('states.restaurant')
    .controller('RestaurantViewCtrl', function (
        $scope,
        $stateParams,
        me,
        Analytics,
        $cordovaSocialSharing,
        $state,
        $ionicModal,
        MyWishedHelper,
        EventDispatcher,
        ShareService,
        ReviewManager,
        $translate,
        ReviewExtraFields,
        MyReviewedHelper,
        RestaurantManager,
        FlashMessageManager,
        MultipleUsersModal,
        ReviewExtraFieldsModal,
        PriceManager,
        CuisineModal,
        $rootScope,
        $log,
        LayoutManager,
        TagModal,
        TagManager,
        InputTextModal,
        InputDateModal,
        TextareaModal
    ) {
        var ctrl = this;
        var
            removeRankingReorderListener,
            removeWishDeleteListener,
            removeReviewDeleteListener,
            removeWishCreateListener,
            removeStateChangeSuccessListener,
            removeReviewCreateListener;
        ctrl.getRangeLabel = getRangeLabel;
        ctrl.getReviewCost = getReviewCost;
        ctrl.getAddressWithCity = getAddressWithCity;
        ctrl.editPrice = editPrice;
        ctrl.saveMyReview = _.debounce(saveMyReview, 300);
        ctrl.goToRanking = goToRanking;
        ctrl.goToReviews = goToReviews;
        ctrl.goToGoogleMaps = goToGoogleMaps;
        ctrl.goToWebsite = goToWebsite;
        ctrl.onPhotoUpload = onPhotoUpload;
        ctrl.onPhotoDelete = onPhotoDelete;
        ctrl.changeCuisine = changeCuisine;
        ctrl.addReviewExtraFields = addReviewExtraFields;
        ctrl.editInputText = editInputText;
        ctrl.tagFriends = tagFriends;
        ctrl.editInputTextByKey = editInputTextByKey;
        ctrl.editTextareaByKey = editTextareaByKey;
        ctrl.incrementVisitCount = incrementVisitCount;
        ctrl.decrementVisitCount = decrementVisitCount;
        ctrl.editLastVisited = editLastVisited;
        ctrl.getField = getField;
        ctrl.trans = $translate;

        initialize();

        function initialize () {
            $log.debug('[CONTROLLER] Initialize');
            ctrl.myLeadersReviews = [];
            ctrl.costRange = '';
            ctrl.myLeadersReviewsPromise = getMyLeadersReviews();
            ctrl.reviewedByMe = isReviewedByMe();
            ctrl.wishedByMe = isWishedByMe();
            ctrl.restaurantPromise = getRestaurant();
            ctrl.myReviewsPromise = getMyReviews();

            removeRankingReorderListener = $rootScope.$on('ranking.reorder', onRankingReorder);
            removeReviewCreateListener = $scope.$on('review.create', onReviewCreate);
            removeReviewDeleteListener = $scope.$on('review.delete', onReviewDelete);
            removeWishCreateListener = $scope.$on('wish.create', onReviewDelete);
            removeWishDeleteListener = $scope.$on('wish.delete', onReviewDelete);
            removeStateChangeSuccessListener = $scope.$on('$stateChangeSuccess', onStateChangeSuccess);

            $scope.$on("$destroy", onDestroy);
            $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

            ctrl.restaurantPromise.then(function (restaurant) {
                ctrl.restaurant = restaurant;
                LayoutManager.setTitle(ctrl.restaurant.name);
                configShare();
            });
            ctrl.myLeadersReviewsPromise.then(function (reviews) {
                ctrl.myLeadersReviews = reviews;
            });
            ctrl.myReviewsPromise.then(function (reviews) {
                ctrl.myReview = reviews[0];
                updateReviewTagFields();
            });
        }

        function onBeforeEnter() {
            if (ctrl.restaurant) {
                LayoutManager.setTitle(ctrl.restaurant.name);
            }
        }

        function onStateChangeSuccess (event, toState) {
            if ((toState.name === 'restaurantView') && ctrl.user) {
                LayoutManager.setTitle(ctrl.restaurant.name);
            }
        }

        function onDestroy () {
            $log.debug('[CONTROLLER] On $destroy');
            if (removeRankingReorderListener) {
                removeRankingReorderListener();
            }
            if (removeReviewCreateListener) {
                removeReviewCreateListener();
            }
            if (removeReviewDeleteListener) {
                removeReviewDeleteListener();
            }
            if (removeWishCreateListener) {
                removeWishCreateListener();
            }
            if (removeWishDeleteListener) {
                removeWishDeleteListener();
            }
            if (removeStateChangeSuccessListener) {
                removeStateChangeSuccessListener();
            }
        }

        function onReviewCreate (event, review) {
            $log.debug('[CONTROLLER] On Review Create', review);
            review.photos = [];
            ctrl.myReview = review;
        }

        function onReviewDelete (event) {
            ctrl.myReview = null;
        }

        function onRankingReorder (event, ranking) {
            $log.debug('[CONTROLLER] On Ranking Reorder', ranking);
            ReviewManager.updatePositionWithRanking(ctrl.myReview, ranking);
        }

        function getRestaurant () {
            return RestaurantManager.findOneById($stateParams.restaurantId)
        }

        function isReviewedByMe () {
            return MyReviewedHelper.get($stateParams.restaurantId);
        }

        function isWishedByMe () {
            return MyWishedHelper.get($stateParams.restaurantId);
        }

        function getMyLeadersReviews () {
            return ReviewManager.findAll({
                leadersOf: me.id,
                restaurant: $stateParams.restaurantId,
                serializationGroups: 'reviewOwner'
            });
        }

        function getMyReviews () {
            return ReviewManager.findAll({
                user: me.id,
                restaurant: $stateParams.restaurantId
            });
        }

        function getRangeLabel () {
            return PriceManager.getRangeLabel(ctrl.restaurant);
        }

        function getReviewCost () {
            return PriceManager.convertAndRound(ctrl.myReview.cost, ctrl.restaurant.geoname);
        }

        function configShare () {
            var message = 'Hey there! The restaurant’s details are: ' +
                ctrl.restaurant.name + ', ' +
                ctrl.restaurant.address + ', ' +
                ctrl.restaurant.geoname.asciiName;

            if (ctrl.restaurant.website) {
                message += ', ' + ctrl.restaurant.website;
            }

            if (ctrl.restaurant.phone) {
                message += ', ' + ctrl.restaurant.phone+ '. ';
            } else {
                message += '. ';
            }

            message += 'Don’t forget to follow me on Tastd!';

            ShareService.config({
                title: 'Check out Tastd',
                message: message,
                link: 'https://tastdapp.com'
            });
        }

        function changeCuisine () {
            CuisineModal.create()
                .then(function(cuisine){
                    ReviewManager.changeCuisine(ctrl.myReview, cuisine)
                        .then(function(newReview){
                            Analytics.trackEvent('review', 'change_cuisine');
                            $scope.$emit('review.cuisineChange');
                            FlashMessageManager.push('flash_message.review.cuisine_updated', 'success');
                            ctrl.myReview = newReview;
                        });
                });
        }

        function getAddressWithCity () {
            // 24, test street
            // 24, test street, New York
            // New York
            // No address
            if(!ctrl.restaurant){
                return null;
            }
            if(ctrl.restaurant.address && ctrl.restaurant.geoname.asciiName){
                return ctrl.restaurant.address + ', ' + ctrl.restaurant.geoname.asciiName;
            }
            return ctrl.restaurant.address || ctrl.restaurant.geoname.asciiName;
        }

        function editPrice () {
            $ionicModal.fromTemplateUrl('js/states/restaurant/review-edit/edit-price.html', {
                scope : angular.extend($scope.$new(), {
                    review : ctrl.myReview,
                    translateSliderValue: function (value) {
                        return PriceManager.getSliderLabel(value, ctrl.myReview.geoname);
                    }
                }),
                animation : 'slide-in-up'
            })
                .then(function (m) {
                    var modalScope = m.scope;
                    modalScope.done = function () {
                        m.remove();
                        Analytics.trackEvent('review', 'change_price');
                        FlashMessageManager.push('flash_message.review.price_updated', 'success');
                        ctrl.saveMyReview();
                    };
                    modalScope.cancel = function () {
                        m.remove();
                    };
                    m.show();
                });
        }

        function saveMyReview () {
            $log.debug('[CONTROLLER] Save my review');
            ctrl.myReview.$save();
        }

        function goToRanking () {
            $state.go('rankingReorder', {
                userId : me.id,
                cityId : ctrl.restaurant.geoname.id,
                cuisineId : ctrl.myReview.cuisine.id
            });
        }

        function goToReviews () {
            $state.go('restaurantReviews', {restaurantId : ctrl.restaurant.id});
        }

        function goToGoogleMaps () {
            window.open('http://www.google.com/maps/place/'+
                ctrl.restaurant.lat + ',' +
                ctrl.restaurant.lng, '_system');
        }

        function goToWebsite () {
            window.open(ctrl.restaurant.website, '_system');
        }

        function onPhotoUpload () {
            Analytics.trackEvent('review', 'photo_upload');
            FlashMessageManager.push('flash_message.review.photo_uploaded', 'success');
        }

        function onPhotoDelete (deletedPhotos) {
            Analytics.trackEvent('review', 'photo_delete');
            FlashMessageManager.push('flash_message.review.photo_deleted', 'success');
        }

        function tagFriends () {
            MultipleUsersModal.create(me.id, ctrl.myReview.taggedFriends)
                .then(function(taggedFriends){
                    ctrl.myReview.taggedFriends = taggedFriends;
                    ctrl.saveMyReview();
                    FlashMessageManager.push('flash_message.review.tag_friends', 'success');
                });
        }

        function addReviewExtraFields () {
            $log.debug('[CONTROLLER] Add review extra field');
            ReviewExtraFieldsModal.create(ctrl.myReview)
                .then(function(action){
                    $log.debug('[CONTROLLER] Resolve add review extra field with action', action);
                    if (action.name === 'ADD') {
                        editExtraField(action.field);
                    } else if (action.name === 'REMOVE') {
                        deleteExtraField(action.field);

                        ctrl.saveMyReview();
                        FlashMessageManager.push('flash_message.review.extra_field_removed', 'success');
                    }
                });
        }

        function editExtraField (field) {
            if (field.modal === 'TEXTAREA') {
                editTextarea(field);
            } else if (field.modal === 'INPUT_TEXT') {
                editInputText(field);
            } else if (field.modal === 'TAGS') {
                editExtraTags(field);
            }
        }

        function editExtraTags (field) {
            $log.debug('[REVIEW_TAGS_PROPERTY_DIRECTIVE] Edit');
            TagModal.create(field.groupId, ctrl.myReview, field.canCreateNewTags)
                .then(function(tags){
                    ReviewManager.replaceTagsWithGroupId(ctrl.myReview, tags, field.groupId);
                    ReviewManager.updateReviewTagFields(ctrl.myReview);
                    ctrl.myReview.$save();
                });
        }

        function deleteExtraField (field) {
            if (field.modal === 'TEXTAREA' || field.modal === 'INPUT_TEXT') {
                ctrl.myReview[field.propertyName] = '';
            } else if (field.modal === 'TAGS') {
                ctrl.myReview = ReviewManager.replaceTagsWithGroupId(ctrl.myReview, [], field.groupId);
                ctrl.myReview = ReviewManager.updateReviewTagFields(ctrl.myReview);
            }
        }

        function editTextarea (field) {
            $log.debug('[CONTROLLER] Edit textarea');
            var fieldName = field.propertyName;
            var title = field.title;
            TextareaModal.create(ctrl.myReview[fieldName], title)
                .then(function(response){
                    $log.debug('[CONTROLLER] Set my review.' + fieldName + ' with value ' + response);
                    ctrl.myReview[fieldName] = response;
                    ctrl.saveMyReview();
                });
        }

        function updateReviewTagFields () {
            ctrl.myReview.bestFor = getTagsWithGroupId(TagManager.BEST_FOR);
            ctrl.myReview.drinks = getTagsWithGroupId(TagManager.DRINKS);
            ctrl.myReview.location = getTagsWithGroupId(TagManager.LOCATION);
            ctrl.myReview.vibe = getTagsWithGroupId(TagManager.VIBE);
            ctrl.myReview.entertainment = getTagsWithGroupId(TagManager.ENTERTAINMENT);
            ctrl.myReview.specialMention = getTagsWithGroupId(TagManager.SPECIAL_MENTION);
            ctrl.myReview.otherTags = getTagsWithGroupId(TagManager.OTHER);
        }

        function getTagsWithGroupId (id) {
            return _.filter(ctrl.myReview.tags, function(t){
                return t.groupId === id;
            });
        }

        function editInputText (field) {
            $log.debug('[CONTROLLER] Edit input text');
            var fieldName = field.propertyName;
            var title = field.title;
            InputTextModal.create(ctrl.myReview[fieldName], title)
                .then(function(response){
                    $log.debug('[CONTROLLER] Set my review.' + fieldName + ' with value ' + response);
                    ctrl.myReview[fieldName] = response;
                    ctrl.saveMyReview();
                });
        }

        function editLastVisited () {
            $log.debug('[CONTROLLER] Edit last visited');
            InputDateModal.create(new Date(ctrl.myReview.lastVisited))
                .then(function(result){
                    $log.debug('[CONTROLLER] Last visited result', result);
                    ctrl.myReview.lastVisited = moment(result).format('YYYY-MM-DD');
                    saveMyReview();
                });
        }

        function editInputTextByKey (key) {
            $log.debug('[CONTROLLER] Edit input text by key');
            var field = ReviewExtraFields.getByKey(key);
            editInputText(field);
        }

        function editTextareaByKey (key) {
            $log.debug('[CONTROLLER] Edit textarea by key');
            var field = ReviewExtraFields.getByKey(key);
            editTextarea(field);
        }

        function getField (key) {
            return ReviewExtraFields.getByKey(key);
        }

        function decrementVisitCount () {
            $log.debug('[CONTROLLER] Decrement visit count');
            ctrl.myReview.visitCount = ctrl.myReview.visitCount > 1 ? ctrl.myReview.visitCount - 1 : 0;
            ctrl.saveMyReview();
        }

        function incrementVisitCount () {
            $log.debug('[CONTROLLER] Increment visit count');
            ctrl.myReview.visitCount ++;
            ctrl.saveMyReview();
        }

    });
