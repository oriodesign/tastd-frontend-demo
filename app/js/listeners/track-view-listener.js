'use strict';

angular
    .module(AppHelper.APP_NAME)
    .run(function ($rootScope, Analytics, $log) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $log.debug('[TRACK VIEW LISTENER] State change success. Track view.');
            Analytics.trackView(toState.name);
        });
    });
