'use strict';

angular
    .module('directives.review')
    .directive('reviewTagsProperty', function reviewTagsPropertyDirective(
        TagModal,
        TagManager,
        ReviewManager,
        $log
    ) {

        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'js/directives/review/review-tags-property.html',
            scope : {
                review : '=',
                field: '=',
                visible: '@'
            },
            link: function (scope) {
                $log.debug('[REVIEW_TAGS_PROPERTY_DIRECTIVE] Controller', scope.field.title);
                scope.canCreateNewTags = scope.field.canCreateNewTags || false;
                scope.edit = edit;

                return scope;

                function edit () {
                    $log.debug('[REVIEW_TAGS_PROPERTY_DIRECTIVE] Edit');
                    TagModal.create(scope.field.groupId, scope.review, scope.canCreateNewTags)
                        .then(function(tags){
                            ReviewManager.replaceTagsWithGroupId(scope.review, tags, scope.field.groupId);
                            ReviewManager.updateReviewTagFields(scope.review);
                            scope.review.$save();
                        });
                }

            }

        };


    });
