'use strict';

(function (AppHelper, q, enabled) {
    function fbAsyncInitPromise() {
        var d = q.defer();

        if(!AppHelper.isWebApp() || enabled === false) {
            d.resolve();
        }else{
            // global function that is called when facebook sdk is loaded
            window.fbAsyncInit = function () { d.resolve(); };
        }
        return d.promise;
    }
    function loadFacebookSdk() {
        // Load the SDK asynchronously
        // only if we are into a web app context because into
        // cordova build context the sdk would be provided by
        // the facebookconnect cordova plugin (com.phonegap.plugins.facebookconnect)

        if(AppHelper.isWebApp() && enabled === true) {

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s);
                js.id = id;
                js.src = '//connect.facebook.net/en_US/all.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        }
    }

    // attach loadFacebookSdk function to the
    // global app object for further use
    AppHelper.loadFacebookSdk = loadFacebookSdk;

    // adds fb async init promise
    AppHelper.beforeAngular(fbAsyncInitPromise);

})(window.AppHelper, window.Q, window.PARAMETERS.FACEBOOK.ENABLED);
