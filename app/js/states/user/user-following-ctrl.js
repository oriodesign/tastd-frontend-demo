'use strict';

angular
    .module('states.user')
    .controller('UserFollowingCtrl', function (
        $scope,
        Analytics,
        $state,
        UserManager,
        $stateParams
    ) {
        var ctrl = this;
        ctrl.$state = $state;
        ctrl.loading = true;
        ctrl.users = [];
        ctrl.findMore = findMore;
        ctrl.query = {
            name : ''
        };
        ctrl.findMore = findMore;
        ctrl.noUsersMessage = 'user.no_followings';
        ctrl.loadMore = loadMore;
        ctrl.search = search;
        ctrl.title = 'user.following.page_title';

        initialize();

        function initialize () {
            search();
        }

        function search () {
            ctrl.loading = true;
            ctrl.users.length = 0;
            return UserManager.findLeadersOf($stateParams.userId, ctrl.query.name)
                .then(function (users) {
                    ctrl.users = users;
                    ctrl.loading = false;
                });
        }

        function loadMore () {
            return ctrl.users
                .$fetchMore()
                .$asPromise().then(function (users) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return users;
                });
        }

        function findMore() {
            $state.go('userSearch');
        }

    });
