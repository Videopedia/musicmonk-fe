var tabActiveClass= "active";
var navtopSearch = require("./navtopSearch.js");

function initScroll(o){
    var lastScrollPos = 0, lastMargin = 0;
    var minMargin = -1 * (o.header.attr('scroll-upto') || o.header.height());
    function changeHeaderMargin(delta){
        var newMargin = lastMargin + delta;
        if(newMargin < minMargin) newMargin = minMargin;
        if(newMargin > 0) newMargin = 0;
        if(newMargin != lastMargin){
            o.header.css('margin-top', newMargin + "px");
            lastMargin = newMargin;
        }
    }

    o.window.scroll(function(event){
        var scrollTop = o.window.scrollTop();
        changeHeaderMargin(lastScrollPos - scrollTop);
        lastScrollPos = scrollTop;
    });
}

function initTabs(tabs){
	tabs.click(function(){
		var t = $(this);
		if(t.hasClass('activatable')){
			tabs.removeClass(tabActiveClass);
			t.addClass(tabActiveClass);
		}
	});
}

module.exports = function(jqObjects, params){
    initScroll(jqObjects);
    initTabs(params.tabs);
    navtopSearch(jqObjects, {
    	tabsRow: params.tabsRow,
    	searchButton: params.searchButton,
    	searchBar: params.searchBar,
    	searchClose: params.searchClose,
    	searchInput: params.searchInput
    });
}