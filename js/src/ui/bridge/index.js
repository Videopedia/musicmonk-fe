require('./newBridge.js')();

var page = $('#conversation-page').clone().removeClass('template').removeClass('page');
var bridgeTemplate = $(page.find('.conversation')[0]).clone();
page.find('.conversation').remove();

var win = $(window);

function getPage(){
	return page.clone();
}

function getBridge(data){
	var bridge = bridgeTemplate.clone();
	bridge.find('.bridge-title').text(data.bridge.title);
	bridge.find('.bridge-description').text(data.membership.type);
	return bridge;
}

function load(){
	win.trigger('fetching-new-list');

	$.ajx({
		url: '/memberships',
		method: 'GET'
	}).done(function(data){
		var page = getPage();
		page.find('.conversations').html(data.memberships.map(getBridge));
		win.trigger('new-list-available', {
			html: page,
			type: 'bridge-home'
		});
	}).fail(function(jqxhr, status){
		userAlert(status);
	});
}

module.exports = function(){
	$('#navtab-bridge').click(function(){
		load();
	});
}