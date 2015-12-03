'use strict';

angular
    .module('modals.geoname', [])
    .factory('GeonameModal', function GeonameModalFactory(
        $ionicModal,
        GeonameManager,
        $q,
        $log,
        $rootScope,
        Security
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.search = _.debounce(search, 300);
        modalScope.choose = choose;
        modalScope.loadMore = loadMore;
        modalScope.chooseAll = chooseAll;
        modalScope.allCities = false;

        return {
            create: create,
            createWithAllCities: createWithAllCities
        };

        function create () {
            modalScope.allCities = false;

            return baseCreate();
        }

        function createWithAllCities () {
            modalScope.allCities = true;

            return baseCreate();
        }

        function baseCreate () {
            $log.debug('[GEONAME_MODAL] Create');
            deferred = $q.defer();
            modalScope.geonames = [];

            modalScope.parameters = {
                name: ''
            };
            createModal();
            search();

            return deferred.promise;
        }

        function search () {
            $log.debug('[GEONAME_MODAL] Search start');
            modalScope.geonames.length = 0;
            modalScope.loading = true;
            var parameters = {};
            if (modalScope.parameters.name.trim() !== '' ) {
                parameters.asciiName = modalScope.parameters.name
            } else if (modalScope.parameters.name.trim() === '' && Security.user) {
                parameters.user = Security.user.id;
            }

            GeonameManager.findAll(parameters).then(function (geonames) {
                $log.debug('[GEONAME_MODAL] Search end');
                modalScope.geonames = geonames;
                modalScope.loading = false;
            });
        }

        function createModal () {
            $log.debug('[GEONAME_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/geoname/geoname-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function choose (geoname) {
            $log.debug('[GEONAME_MODAL] Choose');
            deferred.resolve(geoname);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[GEONAME_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[GEONAME_MODAL] Clean up');
            modalScope.geonames = [];
            modalScope.parameters.name = '';
            ionicModal.remove();
        }

        function loadMore () {
            $log.debug('[GEONAME_MODAL] Load More');
            modalScope.geonames.$fetchMore().$asPromise().then(function () {
                modalScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        function chooseAll () {
            $log.debug('[GEONAME_MODAL] Choose all');
            deferred.resolve('all');
            ionicModal.hide().then(cleanUp);
        }

    });
