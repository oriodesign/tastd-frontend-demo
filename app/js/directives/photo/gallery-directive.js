'use strict';

angular
    .module('directives.photo')
    .directive('gallery', function GalleryDirective(
        Loader,
        $timeout,
        $ionicSlideBoxDelegate
    ) {

        var GALLERY_TPL_URL = 'js/directives/photo/gallery.html';
        var PHOTO_TPL_URL = 'js/directives/photo/photo.html';

        function groupPhotos(photos) {
            var groups = [];
            if (photos.length === 0) {
                return [];
            }
            // fake photo: addRemove button
            photos.push({
                _isAddRemove : true
            });
            angular.forEach(photos, function (photo, i) {
                if (i % 3 === 0) {
                    groups.push([]);
                }
                groups[Math.floor(i / 3)].push(photo);
            });
            photos.pop();
            return groups;
        }

        return {
            restrict : 'EA',
            replace : true,
            templateUrl : GALLERY_TPL_URL,
            controllerAs : 'ctrl',
            controller : function (
                PhotoUpload,
                PhotoManager,
                Photo,
                $ionicModal,
                $scope,
                $q
            ) {
                var ctrl = this;
                ctrl.numberSelected = 0;
                ctrl.selected = new Array($scope.photos.length);

                ctrl.groupedPhotos = groupPhotos($scope.photos);

                ctrl.onClick = function (index) {
                    if (index === $scope.photos.length) {
                        ctrl.addRemove();
                    } else {
                        ctrl.photoClicked(index);
                    }
                };

                ctrl.needFakeBlock = function (row) {
                    if (row === ctrl.groupedPhotos.length - 1) {
                        return ctrl.groupedPhotos[row].length === 1;
                    }
                    return false;
                };

                ctrl.select = function (index) {
                    ctrl.numberSelected = (ctrl.selected[index]) ? (ctrl.numberSelected - 1) : (ctrl.numberSelected + 1);
                    ctrl.selected[index] = !ctrl.selected[index];
                };

                ctrl.photoClicked = function (index) {
                    if (ctrl.numberSelected === 0) {
                        $ionicModal
                            .fromTemplateUrl(PHOTO_TPL_URL, {
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

                                modalScope.delete = function (photo) {
                                    var id = photo.id,
                                        index = $scope.photos.indexOf(photo),
                                        defer = $q.defer();

                                    PhotoManager.findRestmodResource(id).$destroy().$then(function () {
                                        // WORKAROUND for https://github.com/driftyco/ionic/issues/3431
                                        // Ionic Slide Box Breaks on splice an item
                                        $scope.photos.splice(index, 1);
                                        ctrl.groupedPhotos = groupPhotos($scope.photos);
                                        $timeout(function () {
                                            if ($scope.photos.length) {
                                                // shift to the next one or (if it was the last one) to the first one
                                                $ionicSlideBoxDelegate.slide(index % $scope.photos.length);
                                                $ionicSlideBoxDelegate.update();
                                            } else {
                                                m.remove();
                                            }
                                            defer.resolve();
                                        }, 1000);
                                        $scope.onDeletePhoto && $scope.onDeletePhoto([id]);
                                    });
                                    Loader.track(defer.promise);
                                };

                                m.show();
                            });

                    } else {
                        ctrl.select(index);
                    }
                };

                ctrl.uploadPhoto = PhotoUpload.uploadPhotoFactory(function (imageData) {
                    var promise = PhotoManager.createRestmodResource({
                        uploadedPicture : imageData,
                        restaurant : {
                            id : $scope.restaurantId
                        }
                    }).$then(function (photo) {
                        $scope.photos.push(photo);
                        ctrl.groupedPhotos = groupPhotos($scope.photos);
                        $scope.onUploadPhoto && $scope.onUploadPhoto(photo);
                    }).$asPromise();

                    Loader.track(promise);
                });

                ctrl.deletePhoto = function (photo) {
                    var id = photo.id,
                        promise = PhotoManager.findRestmodResource(id).$destroy().$then(function () {
                            $scope.photos.splice($scope.photos.indexOf(photo), 1);
                            ctrl.groupedPhotos = groupPhotos($scope.photos);
                            $scope.onDeletePhoto && $scope.onDeletePhoto([id]);
                        }).$asPromise();

                    Loader.track(promise);
                };

                ctrl.addRemove = function () {
                    if (ctrl.numberSelected === 0) {
                        ctrl.uploadPhoto();
                    } else {
                        var promises = [],
                            deleted = [],
                            toBeRemoved = [];
                        angular.forEach($scope.photos, function (photo, index) {
                            if (ctrl.selected[index]) {
                                promises.push(PhotoManager.findRestmodResource(photo.id).$destroy().$asPromise());
                                deleted.push(photo.id);
                                toBeRemoved.push(photo);
                            }
                        });

                        Loader.track($q.all(promises).then(function () {
                            angular.forEach(toBeRemoved, function (photo) {
                                $scope.photos.splice($scope.photos.indexOf(photo), 1);
                            });
                            ctrl.selected = new Array($scope.photos.length);
                            ctrl.groupedPhotos = groupPhotos($scope.photos);
                            $scope.onDeletePhoto && $scope.onDeletePhoto(deleted);
                        }));
                    }
                };
            },
            scope : {
                photos : '=',
                restaurantId : '=',
                onUploadPhoto : '&',
                onDeletePhoto : '&'
            }
        };
    });
