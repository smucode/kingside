define(['underscore'], function(_) {

x    * determine whose move it is
x        - some games determined on client
x        - some games on server

    * update board
    * move events from board
    * validate move with rex
    * update from rex
    * update from server
    * send move to server
    
    --
    
    Kingside:
        
        var game = new Game('p1', 'p2');
    
    Game:
    
        Fac.c (p1_type, p2_type, cb) {
            Fac.c(p2_type, 'b', fn(p2) {
                Fac.c(p1_type, !p2.col, fb(p1) {
                    // we have the colors, create the game
                    cb(new Game(p1, p2));
                })
            });
        }
        
        Game(p1, p2) {
            var rex = new;
            
            var board = new; // could be injected to share one board

            rex.onMove(p1, p2, fn() {
                // re-render and determine if a move is allowed
                board.update(evt: evt, w: p1, b: p2);
            });

            // update rex if cpu/remote moves
            p1.onMove(rex.playerMoved);
            p2.onMove(rex.playerMoved);


            // board and rex just communicates, no need to involve local
            // if local_remote, fire event to server?
            board.onMove(rex.playerMoved);

        };
    
    Player
        
        // no need for board in ctor, game handles this...
        
        Garbo
            rex.onMove
                calculate move if my turn
        Local
            rex.onMove
                do nothing
        Remote
            just fire event when move is recieved from server (if it's its turn)


    // create player prototype
        getColor
        boardUpdated
        onMove
        //etc...
        

});
