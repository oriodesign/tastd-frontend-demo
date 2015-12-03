'use strict';

angular
    .module('states.notification')
    .controller('NotificationCtrl', function NotificationsCtrl(
        PushMessageManager,
        me,
        Loader,
        NotificationBadge,
        $scope,
        $log
    ) {
        var ctrl = this;
        ctrl.loadMore = loadMore;
        ctrl.doRefresh = doRefresh;
        ctrl.pushMessages = [];
        ctrl.loading = true;

        initialize();

        function initialize () {
            loadNotifications().then(function () {
                ctrl.loading = false;
                $log.debug('[CONTROLLER] then');
            });
        }

        function doRefresh () {
            loadNotifications().finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        function loadMore () {
            return ctrl.pushMessages
                .$fetchMore().$asPromise()
                .finally(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function loadNotifications () {
            return PushMessageManager.findAllByUserId(me.id)
                .then(function(pushMessages){
                    $log.debug('[CONTROLLER] pushMessages loaded');
                    ctrl.pushMessages = pushMessages;
                    PushMessageManager.markAllAsSeen(me.id);
                    NotificationBadge.counter = 0;
                });
        }
    });
