angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $ionicPlatform,
        $ionicHistory,
        Platform
    ) {

        $ionicPlatform.ready(function () {
            if (Platform.isAndroid()) {
                document.addEventListener("backbutton", onBackButton, false);
            }
        });

        function onBackButton() {
            $ionicHistory.goBack();
        }
    });
