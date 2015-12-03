'use strict';

angular
    .module(AppHelper.APP_NAME)
    .factory('Loader', function LoaderFactory(
        $injector,
        $log,
        $timeout
    ) {

        var LOADING_TIMEOUT = 20*1000;
        var $ionicLoading              = $injector.get('$ionicLoading'),
            ValidatorViolatedContext   = $injector.get('ValidatorViolatedContext'),
            IonicValidateOnSubmitPopup = $injector.get('IonicValidateOnSubmitPopup'),
            $ionicNavBarDelegate       = $injector.get('$ionicNavBarDelegate');
        var trackingQueue = [];

        var Loader = {
            $loading : {
                show : function(opt){
                    return $ionicLoading.show(angular.extend({}, {
                        template : '<img src="img/loader.png">'
                    }, opt));
                },
                hide : $ionicLoading.hide
            },
            tracking : false,
            timeoutPromise: null,
            isTracking : function(){
                return Loader.tracking;
            },
            trackingQueue: [],
            track : track,
            loadingTimeout: LOADING_TIMEOUT
        };

        function track (promise) {
            $log.debug('[LOADER] Track');
            var trackId = Math.random();
            trackingQueue.push(trackId);
            Loader.tracking = true;
            showLoading();
            promise
                .then(onSuccess, onError)
                .finally(function () {
                    onFinally(trackId);
                });

            return promise;
        }

        function onFinally (trackId) {
            $log.debug('[LOADER] finally');
            trackingQueue = _.without(trackingQueue, trackId);
            if (trackingQueue.length === 0) {
                terminateTracking();
            }
        }

        function onSuccess () {
            $log.debug('[LOADER] on Success');
        }

        function onError (response) {
            $log.debug('[LOADER] On error');
            if (!response) {
                return;
            }
            $log.error(response);
            var context = ValidatorViolatedContext
                .getContextByRestResponse(response);
            new IonicValidateOnSubmitPopup(context).alert();
            return response;
        }

        function showLoading () {
            $log.debug('[LOADER] Show loader');
            Loader.$loading.show();
            startTimer();
        }

        function terminateTracking (){
            $log.debug('[LOADER] Terminate tracking');
            Loader.tracking = false;
            trackingQueue.length = 0;
            endTimer();
            Loader.$loading.hide();
        }

        function startTimer () {
            $log.debug('[LOADER] Start timer');
            if (null !== Loader.timeoutPromise) {
                return;
            }
            Loader.timeoutPromise = $timeout(function(){
                terminateTracking();
            }, Loader.loadingTimeout);
        }

        function endTimer () {
            $log.debug('[LOADER] End timer');
            $timeout.cancel(Loader.timeoutPromise);
            Loader.timeoutPromise = null;
        }

        return Loader;
    });
