'use strict';

angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $rootScope,
        RestError,
        $ionicPopup,
        $state,
        $log,
        Message,
        JsonUtil
    ) {

        $rootScope.$on('$stateChangeError', onStateChangeError);

        function onStateChangeError () {
            $log.error('[ERROR LISTENER] Error on state change, arguments:', arguments);
            var error = RestError.fromResponse(arguments[5]);
            var stackTrace = buildStackTrace(arguments, error);
            showPopupError(error);
            pushError(stackTrace);
        }

        function pushError (stackTrace) {
            var payload = {
                category: 'BUG',
                title: 'stateChangeError',
                content: JsonUtil.toSimpleString({
                    url: window.location.href,
                    stackTrace: stackTrace
                })
            };

            Message.$create(payload);
        }

        function showPopupError (error) {
            $ionicPopup.alert({
                title: 'Whoops.. error on state change!',
                template: error.message
            }).then(function () {
                if(error.$isAuthError()) {
                    $state.go('signin');
                }
            });
        }

        function buildStackTrace(parameters, error) {
            var stackTrace = _.map(parameters, function(x) {
                if (x && x.name) {
                    return x.name;
                }
            });
            stackTrace.concat([error.message]);

            return stackTrace;
        }
    });
