'use strict';

angular
    .module('services.translations', [
        'pascalprecht.translate'
    ])

    .config(function (
        $translateProvider,
        ConfigProvider
    ) {

        ConfigProvider.PARAMETERS.LANGUAGES = [
            {
                'label' : 'italiano',
                'id' :'it'
            },{
                'label' : 'english',
                'id' :'en'
            }
        ];

        var supportedLocales = {
            'it': 'it',
            'it-it': 'it',
            'it-ch': 'it'
        };
        var defaultLocale = 'en';

        setLocale(getLanguage());

        function setLocale(key){
            var locale = supportedLocales[key] || defaultLocale;
            $translateProvider.preferredLanguage(locale);
            ConfigProvider.PARAMETERS.LANGUAGE = locale;
        }

        function getLanguage(){
            return navigator.language.toLowerCase();
        }

    });
