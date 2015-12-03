'use strict';

// http://blog.gospodarets.com/track_javascript_angularjs_and_jquery_errors_with_google_analytics
// http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm

// using a provider+factory pattern so that we can use the Message factory
// in the error handler

angular
    .module(AppHelper.APP_NAME)
    .provider('$exceptionHandler', {
        $get: function(LogHandler) {
            return LogHandler;
        }
    });