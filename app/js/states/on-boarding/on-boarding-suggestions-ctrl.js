'use strict';

angular
    .module('states.onBoarding')
    .controller('OnBoardingSuggestionsCtrl', function (
        me,
        $q,
        $log,
        Review,
        $scope,
        $state,
        FlagManager,
        FlagParametersBagFactory
    ) {

        var ctrl = this;
        ctrl.me = me;
        ctrl.flags = [];
        ctrl.loading = true;
        ctrl.flagParametersBag = null;

        initialize();
        ctrl.loadMore = loadMore;
        ctrl.done = done;

        function initialize () {
            $log.debug('[CONTROLLER] On Boarding suggestion init');
            ctrl.flagParametersBag = FlagParametersBagFactory
                .create();
            ctrl.flagParametersBag.geoname = me.geoname;
            ctrl.flagParametersBag.orderBy = 'score';
            ctrl.flagParametersBag.leadersOf = me.id;

            FlagManager.findAll(ctrl.flagParametersBag.getQueryParameters())
                .then(function (flags) {
                    $log.debug('[CONTROLLER] After find', flags);
                    removePosition(flags);
                    ctrl.loading = false;
                    ctrl.flags = flags;
                });
        }

        function loadMore () {
            $log.debug('[CONTROLLER] Load more');
            return ctrl.flags.$fetchMore().$asPromise()
                .then(function(){
                    removePosition(ctrl.flags);
                })
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function removePosition (flags) {
            _.each(flags, function (flag) {
                flag.position = undefined;
            });
        }

        function done () {
            $log.debug('[CONTROLLER] On Boarding suggestion done');
            if (ctrl.loading) {
                return;
            }
            $state.go('wall');
        }
    });
