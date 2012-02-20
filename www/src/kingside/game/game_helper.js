define(['underscore', '../auth'], function(_, auth) {

    var GameHelper = function() {};

    GameHelper.prototype.isLocalGame = function(game) {
        return !game.remote;
    };

    GameHelper.prototype.isRemoteGame = function(game) {
        return game.remote;
    };

    GameHelper.prototype.isMyMove = function(game) {
        var active = game[game.state.active_color];
        var user = auth.user ? auth.user.email : '';
        return active == 'local' || active == user;
    };

    return new GameHelper();
    
});