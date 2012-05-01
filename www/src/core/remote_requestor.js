define(
    [
        'underscore',
        'socket.io',
        'backbone'
    ], 
    function(_, io, Backbone) {
        var socket = io.connect('http://queensi.de/');

        var RR = function() {
            socket.on('game_ready', _.bind(function(game) {
                console.log(game);
            }));
        };

        RR.prototype.requestGame = function() {
            socket.emit('request_game');
        };

        _.extend(RR.prototype, Backbone.Events);

        return RR;
    }
);