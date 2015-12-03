'use strict';

angular
    .module('entities.tag')
    .factory('Tag', function TagFactory(restmod) {

	    var Tag = restmod.model('/tags').mix({
	    	$extend: {
	    		Model: {
	    			$highlighted: function() {
	    				return this.$search({highlight: true});
	    			}
	    		}
	    	}
	    });

	    return Tag;
    });
