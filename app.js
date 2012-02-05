var RemoteGameService = require('./src/game/remoteGameService').RemoteGameService;

var app = require('./src/app/app').app;

new RemoteGameService(); // todo: should it simply new it self up and expose the instance?