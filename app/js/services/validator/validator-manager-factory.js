'use strict';

angular
    .module('services.validator')
    .factory('ValidatorManager', function ValidatorManagerFactory(
        ValidatorViolatedContext,
        $cordovaKeyboard,
        IonicValidateOnSubmitPopup,
        $q
    ) {

        return {
            validate: validate
        };

        function validate (form, $scope) {
            var deferred = $q.defer();
            if (form.$valid) {
                deferred.resolve();

                return deferred.promise;
            }
            var context = ValidatorViolatedContext.getContextByForm(form);

            if (window.cordova) {
                $cordovaKeyboard.close();
            }

            new IonicValidateOnSubmitPopup(context).alert({
                scope : $scope
            });

            deferred.reject();

            return deferred.promise;
        }
    });
