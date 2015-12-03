'use strict';

angular
    .module('services.analytics.AnalyticsFactory',[])

    // https://github.com/danwilson/google-analytics-plugin

    .factory('Analytics', function AnalyticsFactory(
        $log
    ) {

        var Analytics = {
            trackEventWithParams: trackEventWithParams,
            startTrackerWithId: startTrackerWithId,
            setUserId: setUserId,
            trackView: trackView,
            trackEvent: trackEvent,
            trackException: trackException,
            trackFilters: trackFilters,
        };

        return Analytics;


        function trackEventWithParams (category, action, params) {
            var label = '';
            for(var property in params) {
                label += '/' + property;
            }
            if (typeof window.analytics !== 'undefined') {
                window.analytics.trackEvent(category, action, label);
            }
        }

        function startTrackerWithId (id){
            if (typeof window.analytics !== 'undefined') {
                window.analytics.startTrackerWithId(id);
            }
        }

        function setUserId (userId){
            if (typeof window.analytics !== 'undefined') {
                window.analytics.setUserId(userId);
            }
        }

        function trackView (title){
            $log.debug('[ANALYTICS] Track view', title);
            if (typeof window.analytics !== 'undefined') {
                window.analytics.trackView(title);
            }
        }

        /**
         * @param category (The name you supply for the group of objects you want to track)
         * @param action (A string that is uniquely paired with each category, the type of user interaction)
         * @param opt_label (An optional string to provide additional dimensions to the event data)
         * @param opt_value (An integer that you can use to provide numerical data about the user event)
         * @param opt_noninteraction (A boolean that when set to true, indicates that the event hit will not be used in bounce-rate calculation)
         */
        function trackEvent (){
            $log.debug('[ANALYTICS] Track event', arguments);
            if (typeof window.analytics !== 'undefined') {
                window.analytics.trackEvent.apply(this, arguments);
            }
        }

        function trackException(){
            if (typeof window.analytics !== 'undefined') {
                window.analytics.trackException.apply(this, arguments);
            }
        }

        function trackFilters(stateName, result, MIN_COST, MAX_COST) {
            var labels = [];
            // Tags
            if (result.tags.length === 1) {
                labels.push('single_tag');
            } else if (result.tags.length > 1) {
                labels.push('multiple_tags');
            }
            // Price
            if (result.minCost !== MIN_COST || result.maxCost !== MAX_COST) {
                labels.push('price');
            }
            // cuisines
            if (result.cuisines.length === 1) {
                labels.push('single_cuisine');
            } else if (result.cuisines.length > 1) {
                labels.push('multiple_cuisines');
            }

            if (labels.length > 0) {
                Analytics.trackEvent(stateName, 'filters', labels.join('_and_'));
            }
        }

    });
