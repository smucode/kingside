define('socket.io', function() {
    return io;
});

require.config({
	paths: {
    	backbone: 		'../lib/backbone/backbone',
    	underscore: 	'../lib/underscore/underscore'
  	}
});

define(['kingside'], function(Kingside) {
	new Kingside();
});