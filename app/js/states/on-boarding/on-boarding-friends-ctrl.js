'use strict';

angular
    .module('states.onBoarding')
    .controller('OnBoardingFriendsCtrl', function (
        $q,
        me,
        Leader,
        $log,
        $scope,
        $state,
        EventDispatcher,
        UserManager,
        LayoutManager,
        FriendManager,
        FacebookConnect,
        ValidatorViolatedContext,
        IonicValidateOnSubmitPopup
    ) {
        var ctrl = this;
        ctrl.me = me;
        ctrl.friends = [];
        ctrl.done = done;
        ctrl.loading = true;

        initialize();

        function initialize () {
            searchFriends();
        }

        function done () {
            $state.go('onBoardingTopGurus');
        }

        function searchFriends () {
            $log.debug('[CONTROLLER] Search Friends');
            ctrl.friends = [];
            ctrl.friendsLoading = true;

            FacebookConnect.ensureHasCredential(me)
                .then(function() {
                    $log.debug('[CONTROLLER] After ensure credential');
                    FriendManager.findAll()
                        .then(onGetFriendsSuccess, onGetFriendsError);
                },function(){
                    $log.debug('[CONTROLLER] Ensure has credential error');
                    ctrl.friendsLoading = false;
                    $state.go('onBoardingTopGurus');
                });
        }

        function onGetFriendsSuccess(friends) {
            $log.debug('[CONTROLLER] Friends success');
            ctrl.friends = friends;
            ctrl.friendsLoading = false;
        }

        function onGetFriendsError(restResponse) {
            $log.debug('[CONTROLLER] Friends error');
            ctrl.friendsLoading = false;
            if(restResponse.$response.data.id === 'Facebook') {
                return FacebookConnect.loginWithUpdateCredential(me).then(function(){
                    $log.debug('[CONTROLLER] Search again');
                    searchFriends();
                }, function () {
                    $log.debug('[CONTROLLER] Login with update credential error');
                    $state.go('onBoardingTopGurus');
                });
            }
            var context = ValidatorViolatedContext.getContextByRestResponse(restResponse);
            new IonicValidateOnSubmitPopup(context).alert();
        }

    });
