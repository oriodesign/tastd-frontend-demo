'use strict';

angular
    .module('states.wall')
    .controller('WallCtrl', function (
        me,
        Loader,
        ReviewManager,
        $scope
    ) {
        var ctrl = this;
        ctrl.reviews = [];
        ctrl.me = me;
        ctrl.loading = true;
        ctrl.doRefresh = doRefresh;

        initialize();

        function initialize () {
            loadReviews().then(function () {
                ctrl.loading = false;
            });
        }

        function loadReviews () {
            var parameters = {
                leadersOf: me.id,
                user: me.id,
                orderBy : 'created',
                serializationGroups : 'reviewOwner'
            };
            return ReviewManager.findAll(parameters).then(function(reviews){
                ctrl.reviews = reviews;
            });
        }

        function doRefresh () {
            loadReviews().finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    });
