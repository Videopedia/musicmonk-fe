var Player = require('./controller.js');
var player;
var body, parent, container, displayTimeout;
var fadeClass = 'player-faded', playerForcedHidden;
var vidAttr = "vid";

var storageKeys = {
	lastPlayedSong: 'player_last_played_song'
}

var playButtonClass = {
	play: "glyphicon-play",
	pause: "glyphicon-pause",
	icon: "glyphicon"
};

function hidePlayer(){
    clearTimeout(displayTimeout);
    body.addClass(fadeClass);
}

function showPlayer(forced){
	if(forced || (player && player.isActive())){
		clearTimeout(displayTimeout);
		displayTimeout = setTimeout(function(){
			body.removeClass(fadeClass);
		}, 200);
    }
}

function initPlayer(params){
	body = params.body;
    parent = params.parentContainer;
    container = params.container;

    var currentVideoId;
    var containerInitialHTML = container.html();

	localforage.getItem(storageKeys.lastPlayedSong, function(err, lastPlayedSong){
		player = new Player({
			id: container.attr('id'),
			height: container.css('height'),
			width: container.css('width'),
			defaultVideo: lastPlayedSong || container.attr('yt-default') || '',
			resetContainer: function(){
				container.html(containerInitialHTML);
			},
			onStateChange: function(newState){
				// Manage visibility
				if(player.isActive() && !playerForcedHidden) showPlayer();
				else hidePlayer();

				// Manage play/pause buttons
				$(params.playButtonSelector + " ." + playButtonClass.icon)
					.removeClass(playButtonClass.pause)
					.addClass(playButtonClass.play);
				if(newState == YT.PlayerState.PLAYING){
					$(params.playButtonSelector + "[" + vidAttr + "~='" + currentVideoId + "'] > ." + playButtonClass.icon)
						.addClass(playButtonClass.pause)
						.removeClass(playButtonClass.play);
				}
			},
			onVideoChange: function(videoData){
				if(videoData){
					params.title.html(videoData.title);
					params.vidElems.attr(vidAttr, videoData.videoId);
					currentVideoId = videoData.videoId;
					localforage.setItem(storageKeys.lastPlayedSong, currentVideoId);
				}
			}
		});
	});

	params.bodyRegionOfInterest.on("click", params.playButtonSelector, function() {
		player.playToggle($(this).attr(vidAttr));
    });

    params.bodyRegionOfInterest.on("click", params.nextButtonSelector, function() {
		player.playNext();
	});
}

module.exports = {
    init: function(jqo, params){
        initPlayer(params);
    },
    hide: function(){
    	playerForcedHidden = true;
        hidePlayer();
    },
    show: function(){
    	playerForcedHidden = false;
        showPlayer();
    }
};