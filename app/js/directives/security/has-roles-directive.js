'use strict';

angular
    .module('directives.security')

    .directive('hasRoles', function HasRolesDirective(Security, ngIfDirective) {
        var ngIf = ngIfDirective[0];

        return {

            transclude: ngIf.transclude,
            priority: ngIf.priority,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            link: function($scope, $element, $attr) {
                var roles = $attr.hasRoles.split(/\ +/);
                $attr.ngIf = function() {
                    // if Security.user.roles contains roles
                    return (_.difference(roles, Security.user.roles).length === 0);
                };

                ngIf.link.apply(ngIf, arguments);
            }
        };

    });


