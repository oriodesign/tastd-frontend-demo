'use strict';

angular
    .module('modals.cuisine')
    .factory('CuisineModal', function CuisineModalFactory(
        $ionicModal,
        CuisineManager,
        $q,
        $log,
        $rootScope
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.search = _.debounce(search, 300);
        modalScope.choose = choose;

        return {
            create: create
        };

        function create () {
            $log.debug('[CUISINE_MODAL] Create');
            deferred = $q.defer();
            modalScope.cuisines = [];
            modalScope.parameters = {
                name: ''
            };
            createModal();
            search();

            return deferred.promise;
        }

        function search () {
            $log.debug('[CUISINE_MODAL] Search start');
            modalScope.cuisines.length = 0;
            modalScope.loading = true;
            CuisineManager.findAll().then(function (cuisines) {
                $log.debug('[CUISINE_MODAL] Search end');
                modalScope.cuisines = cuisines;
                modalScope.loading = false;
            });
        }

        function createModal () {
            $log.debug('[CUISINE_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/cuisine/cuisine-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function choose (cuisine) {
            $log.debug('[CUISINE_MODAL] Choose');
            deferred.resolve(cuisine);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[CUISINE_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[CUISINE_MODAL] Clean up');
            modalScope.cuisines = [];
            modalScope.parameters.name = '';
            ionicModal.remove();
        }

    });
