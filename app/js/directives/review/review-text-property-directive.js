'use strict';

angular
    .module('directives.review')
    .directive('reviewTextProperty', function reviewTextPropertyDirective(
        InputTextModal,
        TextareaModal,
        ReviewManager,
        $log
    ) {

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'js/directives/review/review-text-property.html',
            scope : {
                review : '=',
                field: '=',
                textarea: '@'
            },
            link: function (scope) {
                $log.debug('[REVIEW_TEXT_PROPERTY_DIRECTIVE] Controller', scope.field.title);
                scope.edit = edit;

                var modal = scope.textarea === 'true' ? TextareaModal : InputTextModal;

                function edit () {
                    $log.debug('[REVIEW_TEXT_PROPERTY_DIRECTIVE] Edit');
                    var fieldName = scope.field.propertyName;
                    var title = scope.field.title;
                    modal.create(scope.review[fieldName], title)
                        .then(function(response){
                            $log.debug('[CONTROLLER] Set my review.' + fieldName
                                + ' with value ' + response);
                            scope.review[fieldName] = response;
                            scope.review.$save();
                        });
                }

            }

        };


    });
