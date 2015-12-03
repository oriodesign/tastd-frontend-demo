angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $ionicPlatform,
        PushMessageManager,
        NotificationBadge,
        Security
    ) {

        $ionicPlatform.ready(function () {
            document.addEventListener("resume", onResume, false);
        });

        function onResume() {
            if (!Security.user) {
                return;
            }
            PushMessageManager.getUnseenCounter(Security.user.id).then(function(response){
                NotificationBadge.counter = response.data.counter;
            });
        }

    });
