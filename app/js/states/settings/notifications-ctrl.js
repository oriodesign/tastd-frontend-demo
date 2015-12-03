'use strict';

angular
    .module('states.settings')

    .controller('NotificationsCtrl', function (
        Loader,
        notifications
    ) {

        var ctrl = this;

        ctrl.notifications = notifications;
        if(notifications.recap === undefined){
            notifications.recap = true;
        }

        ctrl.save = function(){
            Loader.track(notifications.$save());
        };

    });
