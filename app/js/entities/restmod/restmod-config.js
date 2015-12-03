'use strict';

angular
    .module('entities.restmod')
    .config(function (restmodProvider, ConfigProvider) {
        restmodProvider.rebase({
            $config: {
                urlPrefix: ConfigProvider.apiUrl(),
                style : 'DefaultPacker',
                patchMethod : 'PUT'
            }
        }, 'RestBase');
    });
