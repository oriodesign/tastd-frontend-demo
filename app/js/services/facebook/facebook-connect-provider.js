'use strict';

angular
    .module('services.facebook')
    .provider('FacebookConnect', function FacebookConnectProvider(ConfigProvider) {

        var FACEBOOK = ConfigProvider.facebook(),
            providerOptions = {
                loginResponseTransformer : null
            };

        return {
                init: init,
                options: options,
                $get: $get
            };

        function init() {
            if(window.FB && !window.cordova && FACEBOOK.ENABLED) {
                window.facebookConnectPlugin.browserInit(FACEBOOK.APP_ID, FACEBOOK.API_VERSION);
            }else{
                if(!window.FB) {
                    window.console.warn('No facebook SDK!');
                }
            }
        }

        function options (options) {
            angular.extend(providerOptions, options);
        }

        function $get(
            $rootScope,
            $q,
            $log,
            $injector,
            $http,
            Config
        ) {
            var FacebookConnect = {
                isEnabled: isEnabled,
                login: login,
                ensureHasCredential: ensureHasCredential,
                getLoginStatus: getLoginStatus,
                persistCredential: persistCredential,
                api: api,
                updateMyFacebookCredential: updateMyFacebookCredential,
                loginWithPersistCredential: loginWithPersistCredential,
                loginWithUpdateCredential: loginWithUpdateCredential,
                getMyFacebookCredential: getMyFacebookCredential,
                exchangeLongLivedToken: exchangeLongLivedToken
            };

            function isEnabled() {
                return FACEBOOK.ENABLED;
            }

            /**
             * Do login and update/persist user credential
             * @param me
             * @returns {*}
             */
            function loginWithUpdateCredential(me) {
                return FacebookConnect.login().then(function(credential){
                    return FacebookConnect.updateMyFacebookCredential(me, credential);
                });
            }

            /**
             * Do login and persist for the first time the credential server side
             * @returns {*}
             */
            function loginWithPersistCredential(me) {
                $log.debug('[FACEBOOK_CONNECT] Login with persist credential');
                return FacebookConnect.login().then(function(credential) {
                    $log.debug('[FACEBOOK_CONNECT] Login with persist after');
                    return persistCredential(me, credential);
                });
            }

            /**
             *
             * @param perm
             * @returns {*|promise}
             */
            function login(perm) {
                $log.debug('[FACEBOOK_CONNECT] Login');
                var deferred = $q.defer();
                window
                    .facebookConnectPlugin
                    .login(perm || FACEBOOK.APP_PERMISSIONS.LOGIN,
                    function(response){
                        onFacebookLogin(response, deferred);
                    }, function () {
                        onFacebookLoginError(deferred);
                    });

                return deferred.promise;
            }


            /**
             * Ensure that there is a facebook credential
             * It doesn't mean that the credential is valid
             * @param me
             * @returns {promise}
             */
            function ensureHasCredential(me) {
                $log.debug('[FACEBOOK_CONNECT] Ensure has credential');
                var deferred = $q.defer();
                var fbCredential = getMyFacebookCredential(me);

                if (fbCredential) {
                    $log.debug('[FACEBOOK_CONNECT] Has already a credential');
                    deferred.resolve();
                } else {
                    FacebookConnect.loginWithPersistCredential(me)
                        .then(function(){
                            $log.debug('[FACEBOOK_CONNECT] Login with persist success');
                            deferred.resolve();
                        },function(){
                            $log.debug('[FACEBOOK_CONNECT] Login with persist error');
                            deferred.reject();
                        });
                }

                return deferred.promise;
            }


            /**
             * Persist on server the credential
             * @param me
             * @param credential
             * @returns {*}
             */
            function persistCredential(me, credential) {
                return me.credentials
                    .$build(credential)
                    .$save()
                    .$asPromise();
            }

            /**
             * Update Existing (or persist if it doesn't exist) facebook credential
             * @param newCredential
             * @returns {*}
             */
            function updateMyFacebookCredential(me, newCredential)
            {
                var credential = getMyFacebookCredential(me);

                if (!credential) {
                    return FacebookConnect.persistCredential(me, newCredential);
                }

                credential.token = newCredential.token;
                credential.permissions = newCredential.permissions;
                credential.externalId = newCredential.externalId;
                return credential.$save().$asPromise();
            }

            /**
             * Exchange a short lived token with a long lived
             * @param credential
             */
            function exchangeLongLivedToken(credential) {
                var payload = {
                    token: credential.token
                };
                return $http.post(Config.authUrl()+'/facebook/long-lived-token', payload).then(function(response){
                    credential.token = response.data.token;

                    return credential;
                });
            }

            /**
             * Get facebook credential by provider
             * @param me
             * @returns {*}
             */
            function getMyFacebookCredential(me)
            {
                return _.find(me.credentials, function(x) {
                    return x.provider === 'FACEBOOK';
                });
            }

            function getLoginStatus()
            {
                var deferred = $q.defer();
                window
                    .facebookConnectPlugin
                    .getLoginStatus(function () {
                        deferred
                            .resolve
                            .apply(deferred, arguments);
                    }, function () {
                        deferred
                            .reject
                            .apply(deferred, arguments);
                    });

                return deferred.promise;
            }

            function api(graphPath, permissions) {
                // JS API does not take additional permissions
                var deferred = $q.defer();
                window
                    .facebookConnectPlugin
                    .api(graphPath, permissions, function () {
                        deferred
                            .resolve
                            .apply(deferred, arguments);
                    }, function () {
                        deferred
                            .reject
                            .apply(deferred, arguments);
                    });

                return deferred.promise;
            }


            function onFacebookLogin(response, deferred) {
                $log.debug('[FACEBOOK_CONNECT] On facebook login');
                FacebookConnect
                    .api('/me')
                    .then(function (me) {
                        onFacebookMe(me, response, deferred);
                    }, function (error) {
                        deferred
                            .reject
                            .apply(deferred, [error]);
                    });
            }

            function onFacebookLoginError(deferred) {
                $log.debug('[FACEBOOK_CONNECT] On Facebook login error');
                if(arguments.length) {
                    deferred
                        .reject
                        .apply(deferred, [{message:'The login dialog was dismissed or there was an unknown error'}]);
                }else{
                    $log.error('facebook login results in a error', arguments);
                    deferred
                        .reject
                        .apply(deferred, arguments);
                }
            }

            function onFacebookMe(me, response, deferred) {
                $log.debug('On facebook me', me);
                response.me = me;
                if(providerOptions.loginResponseTransformer) {
                    response = $injector.invoke(providerOptions.loginResponseTransformer, FacebookConnect, {
                        response : response
                    });
                }
                deferred
                    .resolve
                    .apply(deferred, [response]);
            }

            return FacebookConnect;
        }
    })
    .config(function (FacebookConnectProvider) {
        FacebookConnectProvider.init();
    });
