'use strict';

angular
    .module(AppHelper.APP_NAME)
    .run(function (
        $rootScope,
        $log,
        LayoutManager
    ) {

        $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

        function onStateChangeSuccess (event, toState) {
            $log.debug('[CONFIGURE_LAYOUT_LISTENER] On state change success');
            if (toState.layout) {
                LayoutManager.configureLayout(toState.layout);
            }

            if (toState.title) {
                $log.debug('[CONFIGURE_LAYOUT_LISTENER] Set title ' + toState.title);
                LayoutManager.setTranslatedTitle(toState.title);
            }
        }

    });
