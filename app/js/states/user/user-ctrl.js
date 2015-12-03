'use strict';

angular
    .module('states.user')
    .controller('UserCtrl', function (
        me,
        $q,
        UserManager,
        $state,
        $scope,
        Loader,
        $http,
        $stateParams,
        MyLeadersHelper,
        ReviewManager,
        ExpertiseManager,
        ConfirmPopup,
        LayoutManager
    ) {

        var ctrl = this;
        ctrl.me = me;
        ctrl.isMe = ($stateParams.userId === undefined) || me.id === parseInt($stateParams.userId);
        ctrl.reviews = [];
        ctrl.showWall = false;
        ctrl.expertise = null;
        ctrl.user = null;
        ctrl.loading = true;
        ctrl.expertiseLoading = true;
        ctrl.toggleFollow = toggleFollow;
        ctrl.goToCity = goToCity;
        ctrl.doRefresh = doRefresh;

        initialize();

        function initialize () {
            loadData();
            $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
            $scope.$on('navbar.edit', onNavBarEdit);
        }

        function loadData () {
            var id = $stateParams.userId || me.id;
            loadExpertise(id);
            loadUser(id);
            loadReviews(id);
        }

        function onBeforeEnter () {
            if (ctrl.user) {
                LayoutManager.setTitle(ctrl.user.fullName);
            }
        }

        function onNavBarEdit () {
            $state.go('userEdit')
        }

        function loadExpertise (id) {
            return ExpertiseManager.findAll(id).then(function(expertise){
                ctrl.expertise = _.sortBy(expertise, 'count').reverse();
                ctrl.expertiseLoading = false;
            });
        }

        function loadUser (id) {
            return UserManager.findOneById(id).then(function(user){
                ctrl.user = user;
                ctrl.loading = false;
                LayoutManager.setTitle(user.fullName);
            });
        }

        function toggleFollow () {
            if (MyLeadersHelper.get(ctrl.user.id)) {
                unfollowPopup();
            } else {
                Loader.track(MyLeadersHelper.add(ctrl.user.id));
            }
        }

        function unfollowPopup () {
            ConfirmPopup.create('popup.unfollow.title','popup.unfollow.text')
                .then(function(res) {
                    if (res) {
                        return Loader.track(MyLeadersHelper.remove(ctrl.user.id));
                    }
                });
        }

        function loadReviews (id) {
            return ReviewManager.getWallByUserId(id).then(function(reviews){
                ctrl.reviews = reviews;
            });
        }

        function goToCity(city) {
            var params = {
                userId: ctrl.user.id,
                userFirstName: ctrl.user.firstName,
                userLastName: ctrl.user.lastName,
                userFullName: ctrl.user.fullName,
                cityId: city.id,
                cityName: city.name,
                lat: city.lat,
                lng: city.lng
            };

            $state.go('rankingList', params);
        }

        function doRefresh () {
            var id = $stateParams.userId || me.id;
            var p1 = loadExpertise(id);
            var p2 = loadUser(id);
            var p3 = loadReviews(id);

            $q.all([p1, p2, p3]).finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

    });
