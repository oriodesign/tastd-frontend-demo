'use strict';

angular
    .module('modals.filters', [])
    .factory('FiltersModal', function FiltersModalFactory(
        $ionicModal,
        CuisineManager,
        $q,
        $log,
        $rootScope,
        MultipleCuisinesModal,
        PriceManager,
        TagManager
    ) {
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        var MAX_COST = 200;
        var MIN_COST = 0;

        modalScope.cancel = cancel;
        modalScope.done = done;
        modalScope.chooseCuisines = chooseCuisines;
        modalScope.translate = translate;
        modalScope.resetAll = resetAll;
        modalScope.filters = {};
        modalScope.filters.geoname = undefined;
        modalScope.filters.minCost = MIN_COST;
        modalScope.filters.maxCost = MAX_COST;
        modalScope.filters.tags = [];
        modalScope.filters.proposedTags = [];
        modalScope.filters.cuisines = [];
        modalScope.getCuisinesString = getCuisinesString;

        return {
            create: create
        };


        function create(flagParametersBag) {
            $log.debug('[FILTERS_MODAL] Create with flag parameter bag', flagParametersBag);
            deferred = $q.defer();

            modalScope.filters.geoname = flagParametersBag.geoname;
            modalScope.filters.cuisines = flagParametersBag.cuisines;
            modalScope.filters.tags = flagParametersBag.tags;

            if (flagParametersBag.maxCost) {
                modalScope.filters.maxCost = flagParametersBag.maxCost;
            }

            if (flagParametersBag.minCost) {
                modalScope.filters.minCost = flagParametersBag.minCost;
            }

            getProposedTags(flagParametersBag);
            createModal();

            return deferred.promise;
        }

        function resetAll(){
            modalScope.filters.minCost = MIN_COST;
            modalScope.filters.maxCost = MAX_COST;
            modalScope.filters.cuisines = [];
            modalScope.filters.tags = [];
        }

        function getProposedTags (flagParametersBag) {
            $log.debug('[FILTERS_MODAL] Get proposed tags with flagParametersBag', flagParametersBag);
            var parameters = {};

            if (flagParametersBag.users && flagParametersBag.users.length > 0) {
                var usersParameter = _.map(flagParametersBag.users, function (user) {
                    return user.id;
                });
                parameters.users = usersParameter.join(',');
            }

            if (flagParametersBag.leadersOf) {
                parameters.leadersOf = flagParametersBag.leadersOf;
            }

            if (flagParametersBag.geoname) {
                parameters.geoname = flagParametersBag.geoname.id;
            }


            TagManager.findAll(parameters).then(function(tags){
                $log.debug('[FILTERS_MODAL] Get proposed tags result', tags);
                modalScope.filters.proposedTags = tags;
            });
        }

        function createModal() {
            $log.debug('[FILTERS_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/filters/filters-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function chooseCuisines() {
            $log.debug('[FILTERS_MODAL] Choose cuisine');
            return MultipleCuisinesModal.create()
                .then(function(cuisines) {
                    $log.debug('[FILTERS_MODAL] Cuisines result ', cuisines);
                    modalScope.filters.cuisines = cuisines;
                });
        }

        function cancel() {
            $log.debug('[FILTERS_MODAL] Cancel');
            ionicModal.hide();
            deferred.reject();
        }

        function done() {
            $log.debug('[FILTERS_MODAL] Done');
            var result = {
                tags: modalScope.filters.tags,
                cuisines: modalScope.filters.cuisines,
                minCost: modalScope.filters.minCost,
                maxCost: modalScope.filters.maxCost
            };

            deferred.resolve(result);
            ionicModal.hide();
        }


        function translate(value) {
            return PriceManager.getSliderLabel(value, modalScope.filters.geoname);
        }

        function getCuisinesString () {
            if (modalScope.filters.cuisines.length > 0) {
                var cuisinesParameter = _.map(modalScope.filters.cuisines, function (cuisine) {
                    return cuisine.name;
                });
                return cuisinesParameter.join(', ');
            }
        }

    });
