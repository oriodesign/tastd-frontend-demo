'use strict';

angular
    .module('services.config.ConfigProvider', ['services.config.PARAMETERS'])
    .provider('Config', function ConfigProviderFactory(PARAMETERS) {

        var ConfigProvider = this;

        ConfigProvider.PARAMETERS = PARAMETERS;

        ConfigProvider.apiUrl  = apiUrl;
        ConfigProvider.authUrl = authUrl;
        ConfigProvider.publicUrl = publicUrl;
        ConfigProvider.authTokenHeader = authTokenHeader;
        ConfigProvider.env = env;
        ConfigProvider.isDev = isDev;
        ConfigProvider.facebook = facebook;
        ConfigProvider.serverUrl = serverUrl;

        ConfigProvider.$get = function () {
            return {
                PARAMETERS : ConfigProvider.PARAMETERS,
                apiUrl  : apiUrl,
                publicUrl: publicUrl,
                authUrl : authUrl,
                authTokenHeader : authTokenHeader,
                env : env,
                isDev : isDev,
                facebook : facebook,
                serverUrl : serverUrl
            };
        };

        function facebook() {
            return PARAMETERS.FACEBOOK;
        }

        function serverUrl() {
            var url = PARAMETERS.SERVER_URL;

            if(arguments[0]) {
                return url + arguments[0];
            }

            return url;
        }

        function isDev() {
            return env() === 'dev';
        }

        function env() {
            return PARAMETERS.ENV;
        }

        function apiUrl() {
            var url = PARAMETERS.SERVER_URL + PARAMETERS.API_PREFIX;

            if(arguments[0]) {
                return url + arguments[0];
            }

            return url;
        }

        function authUrl() {
            return PARAMETERS.SERVER_URL + PARAMETERS.AUTH_PREFIX;
        }

        function publicUrl () {
            return PARAMETERS.SERVER_URL + PARAMETERS.PUBLIC_API_PREFIX;
        }

        function authTokenHeader() {
            return PARAMETERS.AUTH_TOKEN_HEADER;
        }

        return ConfigProvider;
    });
