var bridgeTitleInput = $('#new-bridge-modal .bridge-name');
var addIdentifierInput = $('#new-bridge-modal .add-bridge-identifier');
var addedIdentifiersHolder = $('#new-bridge-modal .added-identifiers');
var addedIdentifierTemplate = $('#new-bridge-modal .added-identifier').clone();
var modalCloseButton = $('#new-bridge-modal .close-modal');

function resetCreateBridgeForm(){
	bridgeTitleInput.val('');
	addIdentifierInput.val('');
	addedIdentifiersHolder.html('');
}

function getCurrentIdentifiers(){
	var identifiers = [];
	addedIdentifiersHolder.find('.added-identifier').each(function(){
		identifiers.push($(this).attr('identifier'));
	});
	return identifiers;
}

function getAddedIdentifierTemplate(values){
	var clone = addedIdentifierTemplate.clone();
	clone.click(function(){
		$(this).remove();
	});
	clone.find('.added-identifier-display').text(values.display || values.number);
	clone.attr('identifier', values.number);
	return clone;
}

function isValidInput(inp){
	return inp;
}

module.exports = function(){
	resetCreateBridgeForm();

	$('#new-bridge-modal .add-identifier-form').submit(function(event){
		if(isValidInput(addIdentifierInput.val())){
			if(getCurrentIdentifiers().indexOf(addIdentifierInput.val()) == -1){
				addedIdentifiersHolder.append(getAddedIdentifierTemplate({
					number: addIdentifierInput.val().trim()
				}));
			}
			addIdentifierInput.val('');
			addIdentifierInput.blur();
		}
		event.preventDefault();
	});

	$('#new-bridge-modal .add-identifier-form-submit').submit(function(event){
		var identifiers = getCurrentIdentifiers();
		if(identifiers.length > 0){
			$.ajx({
				url: '/bridge',
				method: 'POST',
				data: {
					title: bridgeTitleInput.val().trim(),
					memberIdentifiers: identifiers
				}
			}).done(function(data){
				userAlert("Invitation sent!");
				resetCreateBridgeForm();
				modalCloseButton.click();
				$('#navtab-bridge').click();
			}).fail(function(jqxhr, status){
				userAlert(status);
			});
		}
		else{
			userAlert("Please add at least 1 person");
		}
		event.preventDefault();
	});
}