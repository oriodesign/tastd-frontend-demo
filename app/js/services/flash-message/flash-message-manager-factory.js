'use strict';

angular
    .module('services.flashMessage',[])
    .factory('FlashMessageManager', function FlashMessageManagerFactory (
        $timeout,
        $translate,
        $log
    ) {

        var DURATION = 5000;
        var FlashMessageManager = {
            push: push,
            reset: reset,
            messages: [],
            active: false,
            timeoutPromise: null
        };

        return FlashMessageManager;

        function push (content, category) {
            $log.debug('[FLASH_MESSAGE] Push new message');
            startTimer();
            var message = {
                content: $translate.instant(content),
                category: category || 'info'
            };
            FlashMessageManager.messages.unshift(message);
            FlashMessageManager.active = true;
        }

        function startTimer () {
            $log.debug('[FLASH_MESSAGE] Start timer');
            if (FlashMessageManager.timeoutPromise) {
                $timeout.cancel(FlashMessageManager.timeoutPromise);
            }
            FlashMessageManager.timeoutPromise = $timeout(reset, DURATION);
        }

        function reset() {
            $log.debug('[FLASH_MESSAGE] Reset');
            FlashMessageManager.messages = [];
            FlashMessageManager.active = false;
        }

    });
