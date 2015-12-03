'use strict';

angular
    .module('directives.photo')
    .directive('dynlayoutGallery', function DynlayoutGalleryDirective() {
        var layouts = [
            // 0 foto => niente
            [],
            // 1 foto => 100%
            [['full']],
            // 2 foto => 50% 50%
            [['half-l', 'half-r']],
            // 3 foto => 33% 33% 33%
            [['third-l', 'third', 'third-r']],
            // 4 --> 2 sopra (50% 50%), 2 sotto (50% 50%)
            [['half-l', 'half-r'], ['half-l', 'half-r']],
            // 5 --> 2 sopra (50% 50%), 3 sotto (33%,33%,33%)
            [['half-l', 'half-r'], ['third-l', 'third', 'third-r']],
            // 6 --> 3 sopra (33%,33%,33%), 3 sotto (33%,33%,33%)
            [['third-l', 'third', 'third-r'], ['third-l', 'third', 'third-r']],
            // 7 --> 2 (50% 50%), 2 (50% 50%), 3 (33%,33%,33%)
            [['half-l', 'half-r'], ['half-l', 'half-r'], ['third-l', 'third', 'third-r']],
            // 8 --> 2 (50% 50%), 3(33%,33%,33%),3(33%,33%,33%)
            [['half-l', 'half-r'], ['third-l', 'third', 'third-r'], ['third-l', 'third', 'third-r']],
            // 9 --> 3 (33%,33%,33%),3 (33%,33%,33%),3 (33%,33%,33%)
            [['third-l', 'third', 'third-r'], ['third-l', 'third', 'third-r'], ['third-l', 'third', 'third-r']]
        ];

        function groupPhotos(photos) {
            var layout = layouts[photos.length],
                i = 0,
                arr = [];
            // var arr = angular.copy(layouts[photos.length]);
            angular.forEach(layout, function (group) {
                var tmp = [];
                arr.push(tmp);
                angular.forEach(group, function (photo) {
                    tmp.push({
                        src : photos[i].src,
                        layout : photo,
                        index : i
                    });
                    i++;
                });
            });
            return arr;
        }

        return {
            restrict : 'EA',
            replace : true,
            template : '<span class="dynlayout-gallery-container">' +
                            '<div ng-repeat="group in groupedPhotos track by $index" style="clear:both">' +
                                '<span ng-repeat="photo in group track by $index" ng-click="photoClicked(photo.index)" class="photo-wrapper" ng-class="\'photo-\'+photo.layout">' +
                                    // '<img class="gallery-photo" src="http://d3e9bp48wqwk17.cloudfront.net/restaurant_thumb/553052a522bb2.jpg">' +
                                    '<img class="gallery-photo" ng-src="{{photo.src}}">' +
                                '</span>' +
                            '</div>' +
                        '</span>',
            controller : function ($scope, $ionicModal) {

                var PHOTO_TPL_URL = 'js/directives/photo/photo.html';

                $scope.groupedPhotos = groupPhotos($scope.photos);

                $scope.layout = layouts[$scope.photos.length];
                $scope.photoClicked = function (index) {
                    $ionicModal.fromTemplateUrl(PHOTO_TPL_URL, {
                        scope : angular.extend($scope.$new(), {
                            photoIndex : index
                        }),
                        animation : 'slide-in-up'
                    })
                        .then(function (m) {
                            var modalScope = m.scope;

                            modalScope.close = function () {
                                m.remove();
                            };

                            m.show();
                        });
                };

            },
            scope : {
                photos : '=',
                user : '='
            }
        };
    });
