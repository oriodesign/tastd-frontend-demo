'use strict';

angular
    .module('modals.geoGuru')
    .factory('GeoGuruModal', function CuisineModalFactory(
        $ionicModal,
        UserManager,
        GeonameManager,
        $q,
        $log,
        $rootScope,
        UserGeolocation,
        SimpleLocalStorage,
        Security,
        $state
    ){

        $log.debug('[GEO_GURU_MODAL] Initialize');

        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.addNewGuru = addNewGuru;

        // Result
        modalScope.result = {};
        modalScope.isLoading = isLoading;

        // Infinite scrolling
        modalScope.thereIsNextPage = thereIsNextPage;
        modalScope.loadMore = loadMore;

        // Edit
        modalScope.editGeoname = editGeoname;
        modalScope.editGuru = editGuru;

        // Choose
        modalScope.chooseGeoname = chooseGeoname;
        modalScope.chooseGuru = chooseGuru;
        modalScope.chooseAllGurus = chooseAllGurus;
        modalScope.done = done;

        // Search
        modalScope.searchGeoname = _.debounce(searchGeoname, 300);
        modalScope.searchGuru = _.debounce(searchGuru, 300);

        // Loading
        modalScope.geonameLoading = false;
        modalScope.guruLoading = false;

        // Editing
        modalScope.editingGuru = false;
        modalScope.editingGeoname = false;



        return {
            create: create
        };

        function create () {
            $log.debug('[GEO_GURU_MODAL] Create');
            deferred = $q.defer();
            modalScope.gurus = [];
            modalScope.geonames = [];
            modalScope.parameters = {
                geoname: '',
                guru: ''
            };
            UserGeolocation.getCurrentGeoname().then(function(geoname){
                modalScope.result.geoname = geoname;
                createModal();
                searchGeoname();
                searchGuru();
            });

            return deferred.promise;
        }

        function editGeoname () {
            modalScope.editingGeoname = true;
            modalScope.editingGuru = false;
        }

        function editGuru () {
            modalScope.editingGuru = true;
            modalScope.editingGeoname = false;
        }

        function searchGeoname () {
            $log.debug('[GEO_GURU_MODAL] Search geoname start');
            modalScope.geonames.length = 0;
            modalScope.geonameLoading = true;
            var parameters = modalScope.parameters.geoname.trim() !== '' ? {
                asciiName: modalScope.parameters.geoname
            } : {
                user: Security.user.id
            };
            GeonameManager.findAll(parameters).then(function (geonames) {
                $log.debug('[GEONAME_MODAL] Search end');
                modalScope.geonames = geonames;
                modalScope.geonameLoading = false;
            });
        }

        function searchGuru () {
            $log.debug('[GEO_GURU_MODAL] Search guru start');
            modalScope.gurus.length = 0;
            modalScope.guruLoading = true;
            var parameters = {
                leadersOf: Security.user.id,
                geoname: modalScope.result.geoname.id,
                orderBy: 'geoScore'
            };
            if (modalScope.parameters.guru) {
                parameters.query = modalScope.parameters.guru;
            }

            UserManager.findAll(parameters).then(function (users) {
                $log.debug('[GEONAME_MODAL] Search end');
                modalScope.gurus = users;
                modalScope.guruLoading = false;
            });
        }

        function createModal () {
            $log.debug('[GEO_GURU_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/geo-guru/geo-guru-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function chooseGeoname (geoname) {
            $log.debug('[GEO_GURU_MODAL] Choose geoname');
            modalScope.result.geoname = geoname;
            modalScope.editingGeoname = false;
            modalScope.editingGuru = true;
            modalScope.parameters = {
                geoname: '',
                guru: ''
            };
            searchGuru();
        }

        function chooseGuru (guru) {
            $log.debug('[GEO_GURU_MODAL] Choose guru');
            modalScope.result.guru = guru;
            modalScope.editingGuru = false;
            modalScope.parameters = {
                geoname: '',
                guru: ''
            };
            done();
        }

        function done () {
            $log.debug('[GEO_GURU_MODAL] Done');
            deferred.resolve(modalScope.result);
            SimpleLocalStorage.setObject('lastGeoname', modalScope.result.geoname);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[GEO_GURU_MODAL] Cancel');
            modalScope.editingGuru = false;
            modalScope.editingGeoname = false;
            modalScope.parameters = {
                geoname: '',
                guru: ''
            };
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[GEO_GURU_MODAL] Clean up');
            modalScope.geonames = [];
            modalScope.gurus = [];
            modalScope.parameters.name = '';
            ionicModal.remove();
        }

        function thereIsNextPage() {
            if (modalScope.editingGeoname && modalScope.geonames.$metadata) {
                return modalScope.geonames.$metadata.hasNextPage;
            }
            if (modalScope.editingGuru && modalScope.gurus.$metadata) {
                return modalScope.gurus.$metadata.hasNextPage;
            }
            return false;
        }

        function isLoading () {
            if (modalScope.editingGeoname) {
                return modalScope.geonameLoading;
            }
            if (modalScope.editingGuru) {
                return modalScope.guruLoading;
            }
            return false;
        }

        function chooseAllGurus () {
            modalScope.result.guru = null;
            modalScope.editingGuru = false;
        }

        function loadMore () {
            if (modalScope.editingGeoname) {
                $log.debug('[GEO_GURU_MODAL] Fetch more geonames');
                modalScope.geonames.$fetchMore().$asPromise()
                    .finally(function (data) {
                        $log.debug('[GEO_GURU_MODAL] Fetch more geonames completed');
                        modalScope.$broadcast('scroll.infiniteScrollComplete');
                        return data;
                    });
            } else {
                $log.debug('[GEO_GURU_MODAL] Fetch more gurus');
                modalScope.gurus.$fetchMore().$asPromise()
                    .finally(function (data) {
                        $log.debug('[GEO_GURU_MODAL] Fetch more gurus completed');
                        modalScope.$broadcast('scroll.infiniteScrollComplete');
                        return data;
                    });
            }
        }

        function addNewGuru() {
            $log.debug('[GEO_GURU_MODAL] Add new guru',  modalScope.result.geoname);
            if (modalScope.result && modalScope.result.geoname) {
                $state.go('userSearch', { geoname: modalScope.result.geoname.id });
            } else {
                $state.go('userSearch');
            }

            cancel();
        }

    });
