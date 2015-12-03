'use strict';

angular
    .module('services.http', [
        'services.config'
    ])
    .config(function ($httpProvider) {
        /*jshint sub:true*/
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.common['X-Tastd-AppVersion'] = window.PARAMETERS.APP.VERSION;
    });
