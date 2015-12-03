'use strict';

angular
    .module('modals.cuisine')
    .factory('MultipleCuisinesModal', function MultipleCuisinesModalFactory(
        $ionicModal,
        CuisineManager,
        $q,
        $log,
        $rootScope
    ) {
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.done = done;
        modalScope.toggle = toggle;
        modalScope.selectAll = selectAll;
        modalScope.isAllSelected = isAllSelected;
        modalScope.loading = true;

        return {
            create: create
        };

        function create() {
            $log.debug('[CUISINE_MODAL] Create');
            deferred = $q.defer();
            modalScope.cuisines = [];
            CuisineManager.findAll().then(function(cuisines) {
                modalScope.loading = false;
                modalScope.cuisines = cuisines;
            });

            createModal();

            return deferred.promise;
        }

        function createModal() {
            $log.debug('[CUISINE_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/cuisine/multiple-cuisines-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function toggle(cuisine) {
            $log.debug('[MULTIPLE-CUISINES_MODAL] Toggle');
            var selected = getSelected();
            if (selected.length === 1 && selected[0].id === cuisine.id) {
                return;
            }
            if (isAllSelected()) {
                deselectAll();
            }
            cuisine.selected = !cuisine.selected;
        }

        function cancel() {
            $log.debug('[CUISINE_MODAL] Cancel');
            ionicModal.hide();
            cleanUp();
            deferred.reject();
        }

        function done() {
            $log.debug('[CUISINE_MODAL] Cancel');
            ionicModal.hide();
            deferred.resolve(cleanUp());
        }

        function cleanUp() {
            var selected = getSelected();
            if (selected.length === modalScope.cuisines.length) {
                return [];
            }
            return selected;
        }

        function isAllSelected() {
            // all selected if no cuisine has been selected in the filter (empty means no cuisine filter)
            return getSelected().length === modalScope.cuisines.length;
        }

        function selectAll() {
            _.each(modalScope.cuisines, function(cuisine) {
                cuisine.selected = true;
            });
        }

        function deselectAll() {
            _.each(modalScope.cuisines, function(cuisine) {
                cuisine.selected = false;
            });
        }

        function isNoneSelected() {
            // all selected if no cuisine has been selected in the filter (empty means no cuisine filter)
            return !getSelected().length;
        }

        function getSelected() {
            return _.filter(modalScope.cuisines, function(c) {
                return c.selected;
            });
        }

    });
