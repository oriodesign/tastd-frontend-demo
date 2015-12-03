'use strict';

angular
    .module('services.validator')
    .constant('VALIDATOR_VIOLATION_ERRORS_MESSAGES', {
        required        : 'validator.violation_errors.required', // This value is required
        email           : 'validator.violation_errors.email', // Please enter a valid email
        minlength       : 'validator.violation_errors.minlength', // This value is too short, at least {{ min }} characters long,
        maxlength       : 'validator.violation_errors.maxlength', // This value is too short, at least {{ min }} characters long,
        confirmPassword : 'validator.violation_errors.confirmPassword' // Password should match
    });
