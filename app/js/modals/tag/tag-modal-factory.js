'use strict';

angular
    .module('modals.tag')
    .factory('TagModal', function TagModalFactory(
        $ionicModal,
        TagManager,
        $q,
        $log,
        $rootScope,
        Loader,
        Security
    ){
        var ionicModal = null;
        var deferred = null;
        var tagsGroupId = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.done = done;
        modalScope.toggle = toggle;
        modalScope.loading = false;
        modalScope.isSelected = isSelected;
        modalScope.tags = [];
        modalScope.selectedTags = [];
        modalScope.canCreateNewTags = false;
        modalScope.newTag = TagManager.buildRestmodResource();
        modalScope.saveNewTag = saveNewTag;

        return {
            create: create
        };

        function create (groupId, review, canCreateNewTags) {
            $log.debug('[TAG_MODAL] Create');
            deferred = $q.defer();
            modalScope.tags = [];
            modalScope.canCreateNewTags = canCreateNewTags;
            modalScope.newTag.groupId = groupId;
            modalScope.newTag.name = '';
            tagsGroupId = groupId;
            createModal();
            initializeSelectedTags(review);
            search(groupId);

            return deferred.promise;
        }

        function initializeSelectedTags (review) {
            _.each(review.tags, function (tag) {
                if (tag.groupId === tagsGroupId) {
                    modalScope.selectedTags.push(tag);
                }
            });
        }

        function search (groupId) {
            $log.debug('[TAG_MODAL] Search');
            modalScope.loading = true;
            modalScope.tags = [];

            var parameters = {
                groupId: groupId
            };

            if (modalScope.canCreateNewTags) {
                parameters.user = Security.user.id;
            }

            TagManager.findAll(parameters).then(function (tags) {
                $log.debug('[TAG_MODAL] Search end');
                modalScope.tags = tags;
                modalScope.loading = false;
            });
        }

        function createModal () {
            $log.debug('[TAG_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/tag/tag-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function toggle (tag) {
            $log.debug('[TAG_MODAL] Toggle');
            isSelected(tag) ? remove(tag) : add(tag);
        }

        function add(tag) {
            $log.debug('[TAG_MODAL] Add tag', tag);
            modalScope.selectedTags.push(tag);
        }

        function remove (tag) {
            $log.debug('[TAG_MODAL] Remove tag', tag);
            modalScope.selectedTags = _.reject(modalScope.selectedTags, function(t){
                return t.id === tag.id;
            });
        }

        function isSelected (tag) {
            return _.some(modalScope.selectedTags, function (t) {
                return t.id === tag.id;
            });
        }

        function done () {
            $log.debug('[TAG_MODAL] Done');
            deferred.resolve(modalScope.selectedTags);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[TAG_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[TAG_MODAL] Clean up');
            modalScope.tags = [];
            modalScope.selectedTags = [];
            modalScope.canCreateNewTags = false;
            modalScope.newTag = TagManager.buildRestmodResource();
            ionicModal.remove();
        }

        function saveNewTag () {
            $log.debug('[TAG_MODAL] Save new tag');
            if (modalScope.newTag.name.trim() === '') {
                return;
            }
            var parameters = {
                name: modalScope.newTag.name
            };
            var existingTag = _.find(modalScope.tags, parameters);
            if (existingTag) {
                modalScope.newTag = TagManager.buildRestmodResource();
                return modalScope.selectedTags.push(existingTag);
            }
            parameters.like = false;
            TagManager.findAll(parameters).then(function(tags){
                tags.length > 0 ? pushExistingNewTag(tags[0]) : createNewTag();
            });

        }

        function pushExistingNewTag (tag) {
            modalScope.tags.push(tag);
            modalScope.selectedTags.push(tag);
            modalScope.newTag = TagManager.buildRestmodResource();
        }

        function createNewTag () {
            var promise = modalScope.newTag.$save().$asPromise();
            Loader.track(promise);
            modalScope.tags.push(modalScope.newTag);
            modalScope.selectedTags.push(modalScope.newTag);
            modalScope.newTag = TagManager.buildRestmodResource();
        }

    });
