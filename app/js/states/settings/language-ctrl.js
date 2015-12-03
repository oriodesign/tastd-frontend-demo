'use strict';

angular
    .module('states.settings')

    .controller('LanguageCtrl', function (
        Loader,
        language,
        Config,
        $translate
    ) {

        var ctrl = this;

        // fallback on default device language if no language has been set by the user
        var usedLanguageId = language.id || Config.PARAMETERS.LANGUAGE;

        ctrl.languages = Config.PARAMETERS.LANGUAGES;
        ctrl.language = _.find(ctrl.languages, function(lan){
            return usedLanguageId === lan.id;
        });

        ctrl.save = function(){
            $translate.use(ctrl.language.id);
            language.id = ctrl.language.id;
            Loader.track(language.$save());
        };

    });
