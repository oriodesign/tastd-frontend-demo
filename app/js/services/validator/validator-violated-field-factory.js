'use strict';

angular
    .module('services.validator')
    .factory('ValidatorViolatedField', function ValidatorViolatedFieldFactory(
        VALIDATOR_VIOLATION_ERRORS_MESSAGES,
        $translate
    ){

        function getErrorMessage(errorType, options) {
            var interpolateParams = options && options[errorType] ? options[errorType] : {};
            if(VALIDATOR_VIOLATION_ERRORS_MESSAGES[errorType]) {
                return $translate.instant(VALIDATOR_VIOLATION_ERRORS_MESSAGES[errorType], interpolateParams);
            }

            return errorType;
        }

        function ValidatorViolatedField($name, options) {
            this.name = $name;
            this.errors = [];
            this.options = angular.extend({}, {position: 0}, options || {});
            this.position = this.options.position;
        }

        ValidatorViolatedField.prototype.addError = function (errorType) {
            this.errors.push(getErrorMessage(errorType, this.options));
            return this;
        };

        return ValidatorViolatedField;
    });

