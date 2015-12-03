'use strict';

angular
    .module('services.validator.ionic')
    .directive('ionicValidateOnSubmit', function IonicValidateOnSubmitDirective(
        ValidatorViolatedContext,
        IonicValidateOnSubmitPopup,
        $cordovaKeyboard
    ) {

        return {
            require: 'form',
            restrict : 'A',
            link : link
        };

        function link(scope, element, attrs, formCtrl) {
            element.attr('novalidate','novalidate');
            element.on('submit', function (e) {
                e.preventDefault();
                onSubmit(scope, attrs, formCtrl);
            });
            formCtrl.validateAndSubmit = function(callback, options) {
                var mergedOptions = options || {};
                validateAndSubmit(scope, formCtrl, callback, mergedOptions);
            };
        }

        function validateAndSubmit (scope, formCtrl, callback, options) {
            if(formCtrl.$valid) {
                callback();

                return;
            }
            var context = ValidatorViolatedContext.getContextByForm(formCtrl, options);
            if(window.cordova) {
                $cordovaKeyboard.close();
            }
            new IonicValidateOnSubmitPopup(context).alert({ scope : scope });
        }

        function onSubmit(scope, attrs, formCtrl) {
            if(formCtrl.$valid) {
                /*jshint sub:true*/
                scope.$apply(attrs['ionicValidateOnSubmit']);
                return;
            }
            var options = scope.$apply(attrs['ionicValidateOnSubmitOptions']) || {};
            var context = ValidatorViolatedContext.getContextByForm(formCtrl, options);
            if(window.cordova) {
                $cordovaKeyboard.close();
            }
            new IonicValidateOnSubmitPopup(context).alert({ scope : scope });
        }
    });
