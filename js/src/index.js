var authManager = require('./authManager.js');
var config = require('./config.js')(authManager);
var uiHandler = require('./ui/index.js')();

String.prototype.capitalizeFirstLetter = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}

authManager.init({
	onSignIn: function(data){
		uiHandler.onSignIn(data);
		$('#preloader').remove();
		$('#navtab-bridge').click();
	},
	onSignOut: uiHandler.onSignOut,
	onNewSession: function(){
		$('#preloader').remove();
	}
});

window.onYouTubeIframeAPIReady = function(){
    uiHandler.playerAPIReady();
}

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').catch(function(err) {console.err("Error registering service worker", err);});
}