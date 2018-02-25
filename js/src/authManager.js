var headerKey = {
	authUser: "authuser"
};

var authUser = {};

function setupResponseHeaderHandler(){
	$.ajaxSetup({
		beforeSend: function (jqXHR, settings) {
			jqXHR.setRequestHeader('authtoken', authUser.token || '');
			jqXHR.setRequestHeader('authuserid', authUser.id || '');
		}
	});
}

function showUserProfileModal(closeable){
	$('#user-profile-modal').modal(closeable ? undefined : {
		backdrop: 'static',
		keyboard: false
	});
}

function showOtpModal(){
	$('#profile-otp-modal').modal({
		backdrop: 'static',
		keyboard: false
	});
}

function hideModal(id, callback){
	var md = $('#' + id);
	if(typeof callback == 'function'){
		if(!md.hasClass('in')) callback();
		else md.one('hidden.bs.modal', callback);
	}
	md.modal('hide');
}

function validateOtp(params){
	$.ajx({
		url: "/user",
		method: "POST",
		data: {
			name: (params.name || "").trim(),
			identifier: params.identifier.trim(),
			otp: params.otp.trim(),
		}
	}).done(function(data){
		hideModal("profile-otp-modal", function(){
			authUser.id = data.id;
			authUser.token = data.token;
			authUser.name = data.name;
			localforage.setItem(headerKey.authUser, authUser);
			params.onSignIn(authUser);
		});
	}).fail(function(){
		userAlert("Could not verify otp, please retry");
	});
}

module.exports = {
    init : function(params){
		setupResponseHeaderHandler();

		var urlOtp = $.getUrlParam('otp');
		var urlIdentifier = $.getUrlParam('identifier');
		var urlName = $.getUrlParam('name');

		if(urlIdentifier && urlOtp){
			validateOtp({
				name: urlName,
				identifier: urlIdentifier,
				otp: urlOtp,
				onSignIn: params.onSignIn
			});
		}
		else{
			localforage.getItem(headerKey.authUser, function(err, user){
				if(user && user.id) {
					authUser = user;
					$.ajx({
						url: "/login-test",
						method: "GET"
					}).done(function(data){
						params.onSignIn(authUser);
					}).fail(function(){
						localforage.clear();
						showUserProfileModal();
						params.onNewSession();
					});
				}
				else {
					showUserProfileModal();
					params.onNewSession();
				}
			});
        }

		$('#logout-button').click(function(){
			localforage.clear(function(){
				window.location.reload();
			});
		});

		$('#user-profile-modal .set-user-profile-form').submit(function(){
			$.ajx({
				url: "/user/otp",
				method: "POST",
				data: {
					name: $('#user-profile-modal .set-user-profile-form .user-name').val().trim(),
					identifier: $('#user-profile-modal .set-user-profile-form .user-email').val().trim()
				}
			}).done(function(data){
				hideModal("user-profile-modal", function(){
					showOtpModal();
				});
			}).fail(function(){
				userAlert("Could not proceed, please retry");
			});
		});

		$('#profile-otp-modal .profile-otp-form').submit(function(){
			validateOtp({
				name: $('#user-profile-modal .set-user-profile-form .user-name').val().trim(),
				identifier: $('#user-profile-modal .set-user-profile-form .user-email').val().trim(),
				otp: $('#profile-otp-modal .otp').val().trim(),
				onSignIn: params.onSignIn
			});
		});
	},
};