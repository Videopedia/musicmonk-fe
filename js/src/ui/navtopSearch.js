var searchResultTemplate = $('#simple-row-template').clone().removeClass('template');
function getTemplate(){
	return searchResultTemplate.clone();
}

var	selectors = {
	title: '.media-title',
	description: '.media-description',
	thumbnail: '.media-thumb',
	year: '.media-year',
	vidElems: '.yt-control-play, .like-button, .share-button'
};

var hiddenClass = 'hidden', lastSearchId;

function getHtml(rows){
	var elements = [];
	if(rows){
		rows.forEach(function(row){
			var template = getTemplate();
			template.find(selectors.title).text(row.title.capitalizeFirstLetter());
			template.find(selectors.description).text(row.description);
			if(row.thumbs.length > 0) template.find(selectors.thumbnail).attr('src', row.thumbs[0].url);
			template.find(selectors.year).text(new Date(row.publishTime).getFullYear() || new Date().getFullYear());
			template.find(selectors.vidElems).attr("vid", row.id);
			elements.push(template);
		});
	}
	return elements;
}

function onInputActive(params){
	if(!params.searchInput.isFocused){
		params.tabsRow.addClass(hiddenClass);
		params.searchBar.removeClass(hiddenClass);
		params.searchInput.isFocused = true;
		params.searchInput.focus();
	}
}

function initAutoSearch(input, window){
	var searchTimeout;
	function search(){
		var value = input.val().replace(/\s+/g, ' ').toLowerCase().trim();
		if(value.length > 3 && value != input.lastSearched){
			clearTimeout(searchTimeout);
			lastSearchId = Math.random();
			searchTimeout = setTimeout(function(id){
				input.lastSearched = value;
				window.trigger('fetching-new-list');

				$.ajx({
					url: '/search?q=' + encodeURIComponent(value),
					method: 'GET'
				}).done(function(data){
					if(id == lastSearchId){
						window.trigger('new-list-available', {
							html: getHtml(data.results),
							type: 'search'
						});
					}
					else {
						console.log("searchId changed, skipping last search results");
					}
				}).fail(function(jqxhr, status){
					if(id == lastSearchId)
						window.trigger('new-list-error', status);
				});
			}, 500, lastSearchId);
		}
	}

	input.keyup(function(){
		search();
	});

	input.change(function(){
		search();
	});

	setInterval(function(){
		search();
	}, 600);
}

module.exports = function(jqo, params){
	params.searchButton.click(function(){
		onInputActive(params);
	});
	params.searchInput.focus(function(){
		onInputActive(params);
	});
	initAutoSearch(params.searchInput, jqo.window);

	function deactivateInput(){
		params.tabsRow.removeClass(hiddenClass);
		params.searchBar.addClass(hiddenClass);
	}

	params.searchInput.blur(function(){
		if(!(params.searchInput.val())){
			setTimeout(function(){
				deactivateInput();
			}, 100);
		}
		params.searchInput.isFocused = false;
	});

	params.searchClose.click(function(){
		if(params.searchInput.val()){
			params.searchInput.val("");
			params.searchInput.focus();
		}
		else {
			jqo.window.trigger('list-back');
		}
	});
};