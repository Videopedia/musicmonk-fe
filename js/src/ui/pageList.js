var loader = $('<div class="loader-c"><img src="/static/images/loading.gif" /></div>');

var listStack = [];
var currentList;

module.exports = function(jqo){
	function back(){
		if(listStack.length > 0){
			jqo.main.html(listStack.pop().html);
		}
		else jqo.main.html("");
	}

	jqo.window.on('fetching-new-list', function(){
		jqo.main.html(loader);
	});
	jqo.window.on('new-list-available', function(e, data){
		jqo.main.html(data.html);
		if(currentList && currentList.type != data.type) listStack.push(currentList);
		currentList = data;
		history.pushState({}, "page");
	});
	jqo.window.on('list-back', function(e, data){
		back();
	});
	jqo.window.on('new-list-error', function(e, data){
		jqo.main.html("Sorry, could not show your music: " + data);
	});

	jqo.window.on('popstate', function(event) {
		back();
    });
}