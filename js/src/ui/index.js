module.exports = function(){
    var jqObjectCache = {};
    jqObjectCache.window = $(window);
    jqObjectCache.body = $('body');
    jqObjectCache.header = $('header');
    jqObjectCache.main = $('main');

    require('./navtop.js')(jqObjectCache, {
    	tabsRow: $('#header-tabs'),
    	tabs: $('#header-tabs div'),
    	searchButton: $('#navtab-search'),
		searchBar: $('#search-bar'),
		searchClose: $('#search-bar .search-close'),
		searchInput: $('#search-bar input')
    });
    var player = require('./player/index.js');
    require('./bridge/index.js')();
    require('./user/index.js')();
    require('./eventManager.js')(jqObjectCache, player);
    require('./pageList.js')(jqObjectCache);
	var accountSettings = require('./accountSettings.js')();

    return {
        playerAPIReady: function(){
            player.init(jqObjectCache, {
            	body: jqObjectCache.body,
            	bodyRegionOfInterest: $('main, footer'),
                parentContainer: $('#yt-player-c'),
                container: $('#yt-player'),
                playButtonSelector: '.yt-control-play',
                nextButtonSelector: '.yt-control-next',
                vidElems: $('footer').find('.yt-control-play, .like-button, .share-button'),
				title: $('.yt-now-playing-title')
           });
        },
        onSignIn: accountSettings.onSignIn,
        onSignOut: accountSettings.onSignOut
    };
}