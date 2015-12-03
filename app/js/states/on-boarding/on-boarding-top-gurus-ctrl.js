'use strict';

angular
    .module('states.onBoarding')
    .controller('OnBoardingTopGurusCtrl', function (
        $q,
        me,
        Leader,
        $log,
        $scope,
        $state,
        EventDispatcher,
        UserManager,
        LayoutManager,
        FacebookConnect,
        ValidatorViolatedContext,
        IonicValidateOnSubmitPopup
    ) {
        var ctrl = this;
        var searchParams = {
            orderBy: 'geoScore',
            geoname: me.geoname ? me.geoname.id : 1,
            notUsers: me.id
        };
        ctrl.me = me;
        ctrl.gurus = [];
        ctrl.loadMore = loadMore;
        ctrl.done = done;
        ctrl.loading = true;

        initialize();

        function initialize () {
            var promise = UserManager.findAll(searchParams);
            LayoutManager.setTitle(LayoutManager.getTitle() + ' ' + me.geoname.asciiName);
            promise.then(function(gurus){
                ctrl.gurus = gurus;
                ctrl.loading = false;
            });
        }

        function loadMore () {
            return ctrl.gurus.$fetchMore(searchParams).$asPromise()
                .finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function done () {
            $state.go('onBoardingSuggestions');
        }

    });
