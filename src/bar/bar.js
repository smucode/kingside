define(['underscore'], function(_) {

    client:
        io.request_game

    server
        io.on_request_game
            add_to_game_queue(new fen)
            process_queue
                figure_out_players
                determine_colors
                add_to_running_games(id, fen, white, black)
                io.game_created

    client:
        io.on_game_created(color, id, user_name)
            create_player

    client:
        io.move(move, id);

    server:
        io.on_move
            old_fen = running_games[id].fen;
            new_fen = new Fen(old_fen).move(move).getFen();

            io.move (new_fen, move)

});
