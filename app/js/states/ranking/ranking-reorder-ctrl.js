'use strict';

angular
    .module('states.ranking')
    .controller('RankingReorderCtrl', function (
        me,
        ReviewManager,
        Loader,
        $timeout,
        RankingStateHelper,
        $q,
        $rootScope,
        $scope,
        $translate,
        Analytics,
        $stateParams,
        CuisineManager
    ) {

        var ctrl = this;
        ctrl.pageLoading = true;

        initialize();

        function initialize () {
            loadCuisine();
        }

        function loadCuisine () {
            CuisineManager.findOneById($stateParams.cuisineId)
                .then(function (cuisine) {
                    ctrl.cuisine = cuisine;
                });
        }

        ctrl.rankingPromise = RankingStateHelper.loadRanking({
            user: me.id,
            geoname: $stateParams.cityId,
            orderBy: $stateParams.orderBy,
            cuisine: $stateParams.cuisineId,
            serializationGroups: $stateParams.serializationGroups
        });

        ctrl.rankingPromise.then(function (r) {
            ctrl.ranking = r;

            ctrl.view = {
                showItemReorder : true
            };

            ctrl.pageLoading = false;
        });


        ctrl.refreshRanking = function () {
            return RankingStateHelper.loadRanking({
                user: me.id,
                geoname: $stateParams.cityId,
                orderBy: $stateParams.orderBy,
                cuisine: $stateParams.cuisineId,
                serializationGroups: $stateParams.serializationGroups
            });
        };

        ctrl.loadMore = function () {
            return RankingStateHelper.loadMoreRanking({
                user: me.id,
                geoname: $stateParams.cityId,
                orderBy: $stateParams.orderBy,
                cuisine: $stateParams.cuisineId,
                serializationGroups: $stateParams.serializationGroups
            })
                .then(function () {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
        };

        ctrl.toggleReordering = function () {
            ctrl.view.showItemReorder = !ctrl.view.showItemReorder;
            $scope.layoutConfig.isHomeButtonVisible = !ctrl.view.showItemReorder;
            // when reordering the last added item has to be forgotten
            ctrl.idLastAdded = null;

        };

        ctrl.trackPromise = function (promise) {
            return Loader.track(promise);
        };

        ctrl.moveItem = function (item, from, to) {
            if (from === to) {
                return;
            }
            var promise = $q.when((function () {
                    return item;
            })()).then(function (item) {
                ctrl.ranking.splice(from, 1);
                ctrl.ranking.splice(to, 0, item);
                return ReviewManager.persistOrder(ctrl.ranking);
            });

            return ctrl.trackPromise(promise).then(function(){
                Analytics.trackEvent('ranking', 'reorder');
                $scope.$emit('ranking.reorder', ctrl.ranking);
            });
        };

        return ctrl;
    });

