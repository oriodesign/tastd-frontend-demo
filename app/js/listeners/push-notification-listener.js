'use strict';

angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $rootScope,
        NotificationBadge,
        $cordovaPush
    ) {

        $rootScope.$on('$cordovaPush:notificationReceived', onPushNotification);

        function onPushNotification (event, notification) {

            if (notification.alert) {
                // console.log('notification.alert');
            }

            if (notification.sound) {
                // console.log('notification.sound');
                //var snd = new Media(event.sound);
                //snd.play();
            }

            if (notification.badge) {
                // console.log('notification.badge',notification.badge);
                NotificationBadge.counter = notification.badge;
                $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                    // Success
                }, function(err) {
                    // An error occurred. Show a message to the user
                });
            }
        }

    });
