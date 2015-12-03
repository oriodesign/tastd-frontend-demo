'use strict';

angular
    .module('states.user')
    .controller('UserFollowersCtrl', function (
        $scope,
        UserManager,
        $stateParams,
        $state
    ) {

        var ctrl = this;
        ctrl.$state = $state;
        ctrl.query = {
            name : ''
        };
        ctrl.users = [];
        ctrl.findMore = false;
        ctrl.noUsersMessage = 'user.no_followers';
        ctrl.loadMore = loadMore;
        ctrl.search = search;
        ctrl.loading = true;
        ctrl.title = 'user.follower.page_title';

        initialize();

        function initialize () {
            search();
        }

        function search () {
            ctrl.loading = true;
            ctrl.users.length = 0;
            UserManager.findFollowersOf($stateParams.userId, ctrl.query.name)
                .then(function(users){
                    ctrl.users = users;
                    ctrl.loading = false;
                });
        }

        function loadMore () {
            return ctrl.users
                .$fetchMore()
                .$asPromise().then(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

    });
