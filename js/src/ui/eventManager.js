module.exports = function(jqo, player){
    var window = jqo.window;

    window.on('restricted-view', function(){
        player.hide();
    });
    window.on('normal-view', function(){
        player.show();
    });

    window.on('input-focus', function(){
        window.trigger('restricted-view');
    });
    window.on('input-blur', function(){
        window.trigger('normal-view');
    });

    $('input').on('focus', function(){
        window.trigger('input-focus');
    });
    $('input').on('blur', function(){
        window.trigger('input-blur');
    });
};