'use strict';

angular
    .module('directives.tag')
    .directive('tagList', function TagListDirective() {

        var ADD_TAGS_TPL_URL = 'js/directives/tag/add-tags.html';
        var TAG_LIST_TPL_URL = 'js/directives/tag/tag-list.html';

        return {
            restrict : 'EA',
            replace : true,
            templateUrl : TAG_LIST_TPL_URL,
            controllerAs : 'ctrl',
            controller : function ($scope, TagManager, Loader, $ionicModal, Security) {

                var ctrl = this;

                $scope.$watchCollection('tags', groupTags);

                groupTags();

                function groupTags(){
                    $scope.groupedTags = _.groupBy($scope.tags, function (tag) {
                        return tag.groupId;
                    });
                }

                ctrl.editTags = function () {
                    if(!$scope.enableEdit){
                        return;
                    }
                    if (!$scope.tags) {
                        $scope.tags = [];
                    }

                    Loader.track(
                        TagManager.findAll({
                            user : Security.user.id
                        })
                        .then(function(tags){
                            return $ionicModal.fromTemplateUrl(ADD_TAGS_TPL_URL, {
                                scope : angular.extend($scope.$new(), {
                                    selectedTags : $scope.tags,
                                    tags : tags
                                }),
                                animation : 'slide-in-up'
                            })
                            .then(function (m) {
                                var modalScope = m.scope;

                                modalScope.done = function () {
                                    m.remove();
                                    $scope.onAfterEdit && $scope.onAfterEdit($scope.tags);
                                };
                                m.show();
                            });

                        })
                    );

                };

            },
            compile: function(element, attrs){
                attrs.buttonClass = attrs.buttonClass || '';
                attrs.listClass = attrs.listClass || '';
            },
            scope : {
                tags : '=',
                enableEdit : '=',
                showButton : '=',
                onAfterEdit : '&',
                buttonClass : '=',
                listClass : '='
            }
        };
    });
