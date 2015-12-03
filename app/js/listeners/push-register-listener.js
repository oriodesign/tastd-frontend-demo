angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $ionicPlatform,
        $cordovaPush,
        DeviceManager,
        Security,
        $q,
        Platform,
        $rootScope
    ) {
        var devices = [],
            iOsConfig = {
                "badge": true,
                "sound": true,
                "alert": true
            };

        $rootScope.$on(Security.EVENTS.LOGIN_SUCCESS, onSecurityEvent);
        $rootScope.$on(Security.EVENTS.SIGNUP_SUCCESS, onSecurityEvent);
        $rootScope.$on(Security.EVENTS.REMEMBER_ME_SUCCESS, onSecurityEvent);

        $ionicPlatform.ready(function () {
            checkSecurityUser().then(findMyDevices);
        });

        function onSecurityEvent (e) {
            // console.log("SECURITY EVENT", e);
            checkSecurityUser().then(findMyDevices);
        }

        function findMyDevices() {
            DeviceManager.findAllByUserId(Security.user.id).then(pushSubscribe);
        }

        function checkSecurityUser() {
            var deferred = $q.defer();
            var intervalId = setInterval(function(){
                if (Security.user) {
                    clearInterval(intervalId);
                    deferred.resolve();
                }
            }, 1000);

            return deferred.promise;
        }

        function pushSubscribe(results) {
            devices = results;
            if (Platform.isIOS()) {
                $cordovaPush.register(iOsConfig).then(updateIOSDevice, updateIOSDeviceError);
            } else if (Platform.isAndroid()) {
                // alert(Platform.getDebugString());
            } else {
                // alert(Platform.getDebugString());
            }
        }

        function updateIOSDevice(deviceToken) {
            // console.log(deviceToken, 'Device TOKEN');
            var currentDevice = _.find(devices, function(device){
                // console.log('Device Token MATCH');
                return device.token === deviceToken;
            });
            if (currentDevice) {
                return;
            }
            // console.log('Device Token MISS, create a new one');
            DeviceManager.createIOSDevice(deviceToken, Security.user.id);
        }

        function updateIOSDeviceError(error) {
            // alert("Registration error: " + error);
        }

    });
