var PlaylistLength = 20;

function getRandomCluster(videoId){
	return [];
}

module.exports = {
	getPlaylist: function(startVideoId){
		var playlist = startVideoId ? [startVideoId] : [];
		return playlist.concat(getRandomCluster(startVideoId)).slice(0, PlaylistLength);
	}
}