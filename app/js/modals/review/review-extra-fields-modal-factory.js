'use strict';

angular
    .module('modals.review', [])
    .factory('ReviewExtraFieldsModal', function ReviewExtraFieldsModalFactory(
        $ionicModal,
        $q,
        $log,
        $rootScope,
        ReviewExtraFields
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.done = done;
        modalScope.toggle = toggle;
        modalScope.reviewExtraFields = ReviewExtraFields;

        return {
            create: create
        };

        function create (review) {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Create');
            deferred = $q.defer();
            updateExtraFields(review);
            createModal();

            return deferred.promise;
        }

        function updateExtraFields (review) {
            var activeProperties = [];
            for (var property in review) {
                if (review.hasOwnProperty(property) && !isEmpty(review[property])) {
                    activeProperties.push(property);
                }
            }
            ReviewExtraFields.activate(activeProperties);
        }

        function isEmpty (p) {
            if (_.isArray(p) || _.isString(p)) {
                return _.isEmpty(p);
            }

            return true;
        }

        function createModal () {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/review/review-extra-fields-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function done () {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Choose');
            deferred.resolve(geoname);
            ionicModal.hide().then(cleanUp);
        }

        function toggle (field) {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Toggle', field);
            var action = {};
            if (field.active) {
                field.active = false;
                action = {
                    'name': 'REMOVE',
                    'field': field
                };
            } else {
                field.active = true;
                action = {
                    'name': 'ADD',
                    'field': field
                };
            }
            deferred.resolve(action);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[REVIEW_EXTRA_FIELDS_MODAL] Clean up');
            ionicModal.remove();
        }

    });
