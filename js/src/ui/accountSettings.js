var profileData;
var hiddenClass = "hidden";
module.exports = function(jqo){
	var elements = {
    	loginButton: $('#login-button'),
    	accountSettingsButton: $('#account-settings')
    };

	return {
		onSignIn: function(pd){
			pd = pd || {};
			profileData = pd;
			if(pd.name) $('.user-display-name').text(pd.name);
			if(pd.imageUrl) elements.accountSettingsButton.attr("src", pd.imageUrl);
		},
		onSignOut: function(){
			elements.loginButton.removeClass(hiddenClass);
			elements.accountSettingsButton.addClass(hiddenClass);
		}
	}
}