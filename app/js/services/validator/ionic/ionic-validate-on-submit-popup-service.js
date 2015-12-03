'use strict';

angular
    .module('services.validator.ionic')
    .factory('IonicValidateOnSubmitPopup', function IonicValidateOnSubmitPopupFactory(
        $rootScope,
        $ionicPopup,
        $translate
    ) {

        var options = {
            title: $translate.instant('error_houston'),
            template: ['<div ng-if="ionicValidateOnSubmitContext.violation.message">',
                          '<p>{{ ionicValidateOnSubmitContext.violation.message }}</p>',
                       '</div>',
                       '<ul ng-show="ionicValidateOnSubmitContext.violatedFields.length">',
                          '<li ng-repeat="violatedField in ionicValidateOnSubmitContext.violatedFields | orderBy:\'position\'">',
                             '<strong>{{ violatedField.name | translate }}</strong>',
                             '<ul>',
                                '<li ng-repeat="error in violatedField.errors">{{ error }}</li>',
                             '</ul>',
                          '</li>',
                        '</ul>'].join('')
        };

        function ionicValidateOnSubmitPopup(context) {
            return {
                context : context,
                alert : function () {
                    var opt = !arguments[0] ? {} : arguments[0];

                    if(!opt.scope) { opt.scope = $rootScope.$new(); }
                    if(!opt.title && context.violation) {
                        opt.title = context.violation.info;
                    }

                    opt.scope.ionicValidateOnSubmitContext = context;

                    return $ionicPopup.alert(angular.extend({}, options, opt));
                }
            };
        }

        return ionicValidateOnSubmitPopup;
    });
