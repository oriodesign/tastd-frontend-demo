'use strict';

angular
    .module('services.log')
    .config(function LogConfig($provide) {

        $provide.decorator('$log', function($delegate, $window, LogStack) {
            var debugFn = $delegate.debug;

            $delegate.debug = function( )
            {
                var args    = [].slice.call(arguments);
                LogStack.push(args);
                debugFn.apply(null, args)
            };

            return $delegate;
        });
    });
