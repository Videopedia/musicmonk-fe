var recommender = require('./recommender.js');

var player;
var availableVideos = 0;
var lastPlayingVideoId;
var awaitingPlay;

function getValidVideoId(id){
	if(!id) return;
	if(id.indexOf("YT:") == 0 || id.indexOf("yt:") == 0 || id.indexOf("Yt:") == 0) id = id.substring(3);
	return id.length == 11 ? id : undefined;
}

function cue(list, play){
	if(list && list.length > 0){
		if(play) {
			awaitingPlay = true;
			player.loadPlaylist(list, 0, 0, "small");
		}
		else player.cuePlaylist(list, 0, 0, "small");
		availableVideos = list.length;
	}
}

function initByVideo(videoId, play){
	var normalizedId = getValidVideoId(videoId);
	if(normalizedId) {
		cue(recommender.getPlaylist(normalizedId), play);
	}
}

function reloadVideos(){
	cue(recommender.getPlaylist(), true);
}

function getVideoData(){
	var data = player.getVideoData();
	if(data){
		data.videoId = data.video_id = "YT:" + data.video_id;
	}
	return data;
}

function play(){
	awaitingPlay = true;
	player.playVideo();
}

function init(params){
	var visibilityChangeTimeout, lastPlayerState;
	player = new YT.Player(params.id, {
        height: params.height,
        width: params.width,
        videoId: getValidVideoId(params.defaultVideo),
        events: {
            onReady: function(){
            	initByVideo(params.defaultVideo);
            },
            onError: function(event){
            	console.log(event);
            	if(parseInt(event.data) != 2){
            		params.resetContainer();
            		init(params);
            	}
            },
            onStateChange: function(event){
            	var newState = event.data, videoData = getVideoData();

				if(videoData && videoData.videoId != lastPlayingVideoId && videoData.title){
					params.onVideoChange(videoData)
					lastPlayingVideoId = videoData.videoId;
				}

				if(newState != YT.PlayerState.PLAYING && awaitingPlay){
					setTimeout(function(){
						player.playVideo();
					}, 1000)
				}

				clearTimeout(visibilityChangeTimeout);
				visibilityChangeTimeout = setTimeout(function(){
					if(player.getPlayerState() != lastPlayerState){
						lastPlayerState = player.getPlayerState();

						if(lastPlayerState == YT.PlayerState.PLAYING){
							awaitingPlay = false;
						}

						params.onStateChange(lastPlayerState);
					}
				}, 100);
            }
        },
        playerVars: {
			showinfo : 0,
			enablejsapi: 1,
			playsinline: 1,
			fs : 1,
			rel: 0,
			color: 'red',
			modestbranding: 1,
			autoplay: 0
		}
    });
    window.ytplayer = player;

	return {
		init: function(videoId){
			initByVideo(videoId);
		},
		playToggle: function(videoId){
			var normalizedId = getValidVideoId(videoId);
			// Start playing a new video
			if(normalizedId && normalizedId != getValidVideoId(lastPlayingVideoId)) {
				initByVideo(videoId, true);
			}
			else {
				// Start playing existing video
				if(player.getPlayerState() != YT.PlayerState.PLAYING){
					play();
				}
				// Pause existing video
				else{
					player.pauseVideo();
				}
			}
		},
		playNext: function(){
			if(availableVideos){
				player.nextVideo();
				availableVideos--;
			}
			else {
				reloadVideos();
			}
		},
		isActive: function(){
			switch(player.getPlayerState()){
        		case YT.PlayerState.ENDED:
        		case YT.PlayerState.PAUSED:
        		case YT.PlayerState.CUED:
        			return false;
        		default:
        			return true;
        	}
		}
	}
}

module.exports = init;