'use strict';

angular
    .module('services.review', [
        'pascalprecht.translate'
    ])
    .factory('ReviewExtraFields', function ReviewExtraFieldsFactory(
        $translate,
        $log,
        TagManager
    ){

        var ReviewExtraFields = {
            activate: activate,
            getByKey: getByKey,
            categories: [
                {
                    name: 'required',
                    required: true,
                    fields: [
                        {
                            key: 'best_for',
                            propertyName: 'bestFor',
                            title: 'modal.review.best_for.title',
                            description: 'modal.review.best_for.description',
                            modal: 'TAGS',
                            groupId: 0
                        }
                    ]
                },
                {
                    name: 'modal.review.category.food',
                    required: false,
                    fields: [
                        {
                            key: 'must_have',
                            propertyName: 'mustHave',
                            title: 'modal.review.must_have.title',
                            description: 'modal.review.must_have.description',
                            modal: 'INPUT_TEXT'
                        },
                        {
                            key: 'drinks',
                            propertyName: 'drinks',
                            title: 'modal.review.drinks.title',
                            description: 'modal.review.drinks.description',
                            modal: 'TAGS',
                            groupId: TagManager.DRINKS
                        },
                        {
                            key: 'dishes',
                            propertyName: 'dishes',
                            title: 'modal.review.dishes.title',
                            description: 'modal.review.dishes.description',
                            modal: 'TEXTAREA'
                        }
                    ]
                },
                {
                    name: 'modal.review.category.atmosphere',
                    required: false,
                    fields: [
                        {
                            key: 'location',
                            propertyName: 'location',
                            title: 'modal.review.location.title',
                            description: 'modal.review.location.description',
                            modal: 'TAGS',
                            groupId: TagManager.LOCATION
                        },
                        {
                            key: 'vibe',
                            propertyName: 'vibe',
                            title: 'modal.review.vibe.title',
                            description: 'modal.review.vibe.description',
                            modal: 'TAGS',
                            groupId: TagManager.VIBE
                        },
                        {
                            key: 'entertainment',
                            propertyName: 'entertainment',
                            title: 'modal.review.entertainment.title',
                            description: 'modal.review.entertainment.description',
                            modal: 'TAGS',
                            groupId: TagManager.ENTERTAINMENT
                        },
                        {
                            key: 'place',
                            propertyName: 'place',
                            title: 'modal.review.place.title',
                            description: 'modal.review.place.description',
                            modal: 'INPUT_TEXT'
                        },
                        {
                            key: 'dress_code',
                            propertyName: 'dressCode',
                            title: 'modal.review.dress_code.title',
                            description: 'modal.review.dress_code.description',
                            modal: 'INPUT_TEXT'
                        }
                    ]
                },
                {
                    name: 'modal.review.category.other',
                    required: false,
                    fields: [
                        {
                            key: 'discovered_on',
                            propertyName: 'discoveredOn',
                            title: 'modal.review.discovered_on.title',
                            description: 'modal.review.discovered_on.description',
                            modal: 'INPUT_TEXT'
                        },
                        {
                            key: 'special_mention',
                            propertyName: 'specialMention',
                            title: 'modal.review.special_mention.title',
                            description: 'modal.review.special_mention.description',
                            modal: 'TAGS',
                            groupId: TagManager.SPECIAL_MENTION
                        },
                        {
                            key: 'other_tags',
                            propertyName: 'otherTags',
                            title: 'modal.review.other_tags.title',
                            description: 'modal.review.other_tags.description',
                            modal: 'TAGS',
                            groupId: TagManager.OTHER,
                            canCreateNewTags: true
                        },
                        {
                            key: 'comment',
                            propertyName: 'comment',
                            title: 'modal.review.comment.title',
                            description: 'modal.review.comment.description',
                            modal: 'TEXTAREA'
                        }
                    ]
                }
            ]
        };

        function activate(properties) {
            $log.debug('[REVIEW_EXTRA_FIELDS] Activate with properties', properties);
            _.each(ReviewExtraFields.categories, function (category){
                _.each(category.fields, function (field) {
                    field.active = _.contains(properties, field.propertyName);
                });
            });
        }

        function getByKey(key) {
            var result = null;
            _.each(ReviewExtraFields.categories, function (category){
                _.each(category.fields, function (field) {
                    if (field.key === key) {
                        result = field;
                    }
                });
            });
            return result;
        }

        _.each(ReviewExtraFields.categories, function (category){
            category.name = $translate.instant(category.name);
            _.each(category.fields, function (field) {
                field.title = $translate.instant(field.title);
                field.description = $translate.instant(field.description);
            });
        });

        return ReviewExtraFields;

    });
