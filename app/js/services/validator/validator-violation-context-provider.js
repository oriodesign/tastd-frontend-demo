'use strict';

angular
    .module('services.validator')
    .provider('ValidatorViolationContext', function ValidatorViolationContextProvider() {
        var providerOptions = {
            debug : false
        };

        this.debug = function (debug) {
            providerOptions.debug = debug;
            return this;
        };

        this.$get = function (ValidatorViolatedField) {

            function ValidatorViolationContext() {
                this.violatedFields = [];
                this.violation = null;
            }

            ValidatorViolationContext.prototype.violatedFields = [];

            ValidatorViolationContext.prototype.setMainViolation = function (type, message, info) {
                this.violation = {
                    type    : type,
                    message : message,
                    info    : providerOptions.debug ? info : null
                };
                return this;
            };

            ValidatorViolationContext.prototype.addViolation = function ($name, errorType, options) {
                var violatedField = window._.find(this.violatedFields, function (violatedField) {
                    return violatedField && violatedField.name === $name;
                });
                if(!violatedField) {
                    violatedField = new ValidatorViolatedField($name, options ? options[$name] : {});
                    violatedField.addError(errorType);
                    this.violatedFields.push(violatedField);
                }else{
                    violatedField.addError(errorType);
                }

                return this;
            };

            return ValidatorViolationContext;
        };

        return this;

    });

