module.exports = function(authManager){
	window.endpointBase = window.location.host.indexOf(":8887") > -1 ? window.location.origin.replace("8887", "8080") : "";
    var config = {
        endpoint: window.endpointBase
    };

    function getUrl(url){
    	return url.indexOf(config.endpoint) == 0 ? url : (config.endpoint + url);
    }

	(function(){
    	window.userAlert = function(msg){
    		alert(msg);
    	}
    })();

	$.ajx = function(params){
		params.url = getUrl(params.url);
		if(typeof params.data == 'object'){
			params.data = JSON.stringify(params.data);
			params.contentType = 'application/json'
		}
		return $.ajax(params);
	}

    $(document).ajaxError(function(event, jqxhr, settings, thrownError){
    	userAlert(settings.url + " => " + jqxhr.status + ", " + thrownError);
    });

    $.getUrlParam = function(paramName){
		var pairs = window.location.search.substring(1).split('&');
		for (var i=0; i<pairs.length; i++){
			var pair = pairs[i].split('=');
			if (pair[0] == paramName){
				return decodeURIComponent(pair[1]);
			}
		}
    }

    return config;
}