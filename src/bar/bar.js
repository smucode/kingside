define(['underscore'], function(_) {

    var game = new (w, b);
    
        var white = new(w);
        var black = new(w);
        
        var board = new();
        
        var rex = new();
        rex.onCreate(board.init);
        
        rex.onMove(white.update);
        rex.onMove(black.update);
        
        white.onReady();
        black.onReady();

        // 
        
        onCreate
        onStart
        onMove

    var kingside = new;
    
        var game = new;
        var status = new;
        
        
});
