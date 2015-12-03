'use strict';

angular
    .module('directives.tag')
    .directive('tagSelector', function TagSelectorDirective(
        $log
    ) {

        var TAG_SELECTOR_TPL_URL = 'js/directives/tag/tag-selector.html';

        function removeItem(array, copy) {
            var toBeRemoved = _.find(array, function (item) {
                return item.id === copy.id;
            });
            array.splice(array.indexOf(toBeRemoved), 1);
        }

        return {
            restrict : 'EA',
            replace : true,
            templateUrl : TAG_SELECTOR_TPL_URL,
            controller : function ($scope, TagManager, Loader) {


                $scope.$watchCollection('tags', groupTags);

                function groupTags(){

                    $scope.grouped = angular.copy($scope.tags);

                    // sort highlight=true first
                    $scope.grouped = _.sortBy($scope.grouped, function (tag) {
                        return tag.highlight ? 0 : 1;
                    });

                    $scope.grouped = _.groupBy($scope.grouped, function (tag) {
                        return tag.groupId;
                    });

                    $scope.newItems = [];
                    angular.forEach($scope.grouped, function (group, groupId) {
                        group.groupName = group[0].groupName;
                        group.groupId = groupId;
                        $scope.newItems[groupId] = {
                            focused : false,
                            name : ''
                        };
                    });

                }

                function findTag(collection, tagName, groupId) {
                    $log.debug('[TAG_SELECTOR] Find Tag');
                    return _.find(collection, function (item) {
                        if (!item) {
                            return false;
                        }
                        return item.name === tagName && item.groupId === parseInt(groupId);
                    });
                }

                function addTagToLists(item) {
                    $log.debug('[TAG_SELECTOR] Add tag to lists');
                    // add tags to tags list only if it is not present yet
                    if (!findTag($scope.selectedTags, item.name, item.groupId)) {
                        $scope.selectedTags.push(item);
                    }
                    var groupedTags = $scope.tags[item.groupId];

                    if (!findTag(groupedTags, item.name, item.groupId)) {
                        groupedTags.$scope.push(item);
                    }
                }

                $scope.isActive = function (tag) {
                    var toBeSelected = _.find($scope.selectedTags, function (selectedTag) {
                        return selectedTag.id === tag.id;
                    });
                    return toBeSelected !== undefined;
                };

                $scope.keyup = function (event, group) {
                    if (event.keyCode === 13) {
                        $scope.addTag(group);
                        event.target.blur();
                        $scope.newItems[group.groupId].focused = false;
                    }
                };


                $scope.addTag = function (group) {
                    $log.debug('[TAG_SELECTOR] Add Tag');
                    var groupedItems = $scope.newItems[group.groupId];
                    if (!groupedItems) {
                        return;
                    }
                    var newTag = groupedItems.name;

                    if (newTag !== '') {
                        Loader.track(
                            TagManager.searchRestmodCollection({
                                name : newTag,
                                groupId : group.groupId
                            })
                                .$then(function (items) {
                                    var tag = findTag(items, newTag, group.groupId);
                                    if (!tag) {
                                        return TagManager.createRestmodResource({
                                            name : newTag,
                                            groupName : group.groupName,
                                            groupId : group.groupId
                                        }).$then(addTagToLists);
                                    } else {
                                        addTagToLists(tag);
                                    }
                                }).$asPromise()
                        );
                    }
                    $scope.newItems[group.groupId].focused = false;
                    $scope.newItems[group.groupId].name = '';
                };

                $scope.select = function (tag) {
                    if ($scope.isActive(tag)) {
                        removeItem($scope.selectedTags, tag);
                    } else {
                        $scope.selectedTags.push(tag);
                    }
                };
            },
            scope : {
                tags : '=',
                enableAdd : '=',
                selectedTags : '='
            }
        };
    });
