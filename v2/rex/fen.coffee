if (typeof module !== 'undefined' && typeof module.require === 'undefined') { module.require = require }

if (typeof define !== 'function') { define = (require('amdefine'))(module) }

define(["require", "underscore"], function(require, _) {

    Fen: (fen) {
        @pieces = {
        @activeColor = null
        @_parse(fen || Fen.initString)
    

    // public

    Fen.initString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    \tmove: (from, to) {
        @_validateMove(from, to)
        @_updateActiveColor()
        @_updateCastling(from, to)
        @_updateEnPassant(from, to)
        @_updateHalfmoveClock(from, to)
        @_updateFullmoveNumber()
        @_updatePiecePlacement(from, to)
    

    \tcanCastle: (letter) {
        return _.include(@castling, letter)
    

    // private

    \t_validateMove: (from, to) {
        piece = @pieces[from]
        if (!piece) {
            throw new Error('You must select a valid piece to move: ' + from)
        }
    

    \t_updateFullmoveNumber: () {
        if (@activeColor == 'w') {
            @fullmove++
        }
    

    \t_updateHalfmoveClock: (from, to) {
        piece = @pieces[from]
        if (@_isPawn(piece) || @pieces[to]) {
            @halfmove = 0
        } else {
            @halfmove++
        }
    

    \t_updateEnPassant: (from, to) {
        piece = @pieces[from]
        if (@_isPawn(piece)) {
            if (@enPassant == to) {
                dir = to.charAt(1) - from.charAt(1)
                delete @pieces[to.charAt(0) + (to.charAt(1) - dir)]
            } else {
                len = to.charAt(1) - from.charAt(1)
                if (Math.abs(len) == 2) {
                    @enPassant = to.charAt(0) + (parseInt(from.charAt(1), 10) + (len / 2))
                    return
                }
            }
        }
        @enPassant = '-'
    

    \t_updateCastling: (from, to) {
        if (!@castling.length) {
            return false
        }
        switch (from) {
            case 'a1': @castling = _.without(@castling, 'Q') break
            case 'a8': @castling = _.without(@castling, 'q') break
            case 'h1': @castling = _.without(@castling, 'K') break
            case 'h8': @castling = _.without(@castling, 'k') break
            case 'e1': 
                if (to == 'g1' && _.contains(@castling, 'K')) {
                    @pieces.f1 = @pieces.h1
                    delete @pieces.h1
                } else if (to == 'c1' && _.contains(@castling, 'Q')) {
                    @pieces.d1 = @pieces.a1
                    delete @pieces.a1
                }
                @castling = _.without(@castling, 'Q', 'K') 
                break
            case 'e8':
                if (to == 'g8' && _.contains(@castling, 'k')) {
                    @pieces.f8 = @pieces.h8
                    delete @pieces.h8
                } else if (to == 'c8' && _.contains(@castling, 'q')) {
                    @pieces.d8 = @pieces.a8
                    delete @pieces.a8
                }
                @castling = _.without(@castling, 'q', 'k') 
                break
        }
    

    \t_updatePiecePlacement: (from, to) {
        piece = @pieces[from]
        delete(@pieces[from])

        if (@_isPawn(piece) && (to.charAt(1) ==  1 || to.charAt(1) == 8)) {
            @pieces[to] = (piece == 'P' ? 'Q' : 'q')
        } else {
            @pieces[to] = piece
        }
    

    \t_updateActiveColor: () {
        @activeColor = @activeColor == 'w' ? 'b' : 'w'
    

    \t_isPawn: (piece) {
        return piece == 'p' || piece == 'P'
    

    \t_parse: (fen) {
        arr = fen.split ? fen.split(' ') : []
        if (!arr || arr.length != 6) {
            throw new Error('A FEN must contain 6 space separated fields: ' + fen)
        }
        @_parsePiecePlacement(arr[0])
        @_parseActiveColor(arr[1])
        @_parseCastling(arr[2])
        @_parseEnPassant(arr[3])
        @_parseHalfmoveClock(arr[4])
        @_parseFullmoveNumber(arr[5])
    

    \t_parsePiecePlacement: (str) {
        arr = str.split('/')
        if (arr.length != 8) {
            throw new Error('A FEN must contain 8 ranks separated by /: ' + str)
        }
        files = 'abcdefgh'
        ranks = '87654321'
        _.each(arr, function(rank, rankIdx) {
            fileIdx = 0
            _.each(rank.split(''), function(p, i) {
                if (!p.match(/[0-8]/)) {
                    an = files.charAt(fileIdx) + ranks.charAt(rankIdx)
                    @pieces[an] = p
                    fileIdx++
                } else {
                    fileIdx += parseInt(p, 10)
                }
            }, this)
        }, this)
    

    \t_parseActiveColor: (col) {
        if (col == 'w' || col == 'b') {
            @activeColor = col
        } else {
            throw new Exception('Illegal active color: ' + col)
        }
    

    \t_parseCastling: (str) {
        if (str.match(/[kqKQ\-].*/)) {
            @castling = str.split('')
        } else {
            throw new Error('Illegal castling string: ' + str)
        }
    

    \t_parseEnPassant: (str) {
        @enPassant = str
    

    \t_parseHalfmoveClock: (str) {
        @halfmove = parseInt(str, 10)
    

    \t_parseFullmoveNumber: (str) {
        @fullmove = parseInt(str, 10)
      

    \ttoString: () {
        fenString = @_readPlacement()   
        fenString += ' ' + @_readColourToMove()
        fenString += ' ' + @_readCastling()
        fenString += ' ' + @_readEnPassant()
        fenString += ' ' + @_readHalfMoves()
        fenString += ' ' + @_readFullMoves()
        return fenString
    

    \t_readPlacement: () {
        str = '', board = {
        _.each(_.range(8, 0, -1), function(rank) {
            emptyCounter = 0
            if(!_.isEmpty(str)) {  
                str += '/'
            }
            _.each(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], function(file) {
                positions = _.keys(@pieces)
                square = file + rank
                if(_.include(positions, square)){
                    piece = @pieces[square]
                    str += emptyCounter > 0 ? emptyCounter + piece : piece
                    emptyCounter = 0
                } else {
                    emptyCounter++
                }
            }, this)
            if (emptyCounter) {
                str += emptyCounter
            }
        }, this)

        return str
    

    \t_readColourToMove: () {
        return @activeColor
    

    \t_readCastling: () {
        return !@castling.length ? '-' : @castling.join('')
    

    \t_readEnPassant: () {
        return @enPassant
    

    \t_readHalfMoves: (){
        return @halfmove
    

    \t_readFullMoves: () {
        return @fullmove
    

    return Fen
})
