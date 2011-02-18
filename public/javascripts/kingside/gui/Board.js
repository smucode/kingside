jsx.declare('kingside.gui');

jsx.require('capa.Game');

jsx.require('jsx.gui.TemplateEngine');

kingside.gui.Board = function() {

  var moveFn;
  var game, stateController;

  var FILES = 'abcdefgh';
  var RANKS = '87654321';
  var DEFAULT_FEN = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2';
  
  var fenMapping = {
    'r': 'black_rook', 'n': 'black_knight', 'b': 'black_bishop', 'q': 'black_queen', 'k': 'black_king', 'p': 'black_pawn',
    'R': 'white_rook', 'N': 'white_knight', 'B': 'white_bishop', 'Q': 'white_queen', 'K': 'white_king', 'P': 'white_pawn' 
  };
  
  var init = function(cb) {
    $.get('views/board.html', function(html) {
      createBoard(html);
      attachEvents();
      (cb || jsx.f)();
    });

  };
  
  var handleEvent = function(data) {
    if (data.type == 'move') {
      var img = $('.board #square_' + data.from + ' img').remove().clone().attr('style', '');
      if (data.promotion) {
        img.attr('src', img.attr('src').replace('pawn', 'queen'));
      }
      $('.board #square_' + data.to).html(img);
      makeDraggable(img);
      if (data.enpassant) {
        $('.board #square_' + data.enpassant).html('');
      }
      if (data.castle) {
        $('.board #square_' + data.castle.to).html($('.board #square_' + data.castle.from + ' img').remove());
      }
    }
  };
  
  var createBoard = function(html) {
    var templateEngine = new jsx.gui.TemplateEngine();
    $('.board').remove();
    $('body').prepend(templateEngine.process(html));
    $('.board tr:odd td.square:even').addClass('dark');
    $('.board tr:even td.square:odd').addClass('dark');
  };
  
  var createPieces = function(fen) {
    var board = fen.split(' ')[0];
    $('.board img').remove();
    _.each(board.split('/'), function(rankFen, rank) {
      var file = 0;
      _.each(rankFen, function(sq, i) {
        if (isNaN(sq)) {
          var img = $('<img></img>').attr('src', 'images/' + fenMapping[sq] + '.png');
          $('#square_' + FILES[file++] + RANKS[rank]).html(img);
        } else {
          file += parseInt(sq, 10);
        }
      });
    });
    makeDraggable($('.board img'));
  };
  
  var attachEvents = function() {
    $('.board').mouseover(mouseOverSquare).mouseout(mouseOutSquare).mousedown(mouseDownSquare).mouseup(mouseUpSquare);
    $('.board td').droppable({
      drop: pieceDropped,
      hoverClass: 'valid'
    }).droppable('disable');
  };
  
  var makeDraggable = function(elem) {
    elem.draggable({
      containment: '.board',
      revert: 'invalid'
    });
  };
  
  var pieceDropped = function(evt, ui) {
    var source = $(ui.draggable).parent().attr('id').replace('square_', '');
    var target = $(evt.target).attr('id').replace('square_', '');
    
    game.move(source, target);
    
    $('.board .target').removeClass('target');
    $('.board .ui-droppable').droppable('disable');
    $('.board .highlight').removeClass('highlight');
  };
  
  var mouseUpSquare = function(evt) {
    $('.board .target').removeClass('target');
  };
  
  var mouseDownSquare = function(evt) {
    if ($(evt.target).parent().hasClass('highlight')) {
      var square = $(evt.target).parent().attr('id').replace('square_', '');
      var valid = (game && game.getMoves(square)) || [];
      if (valid.length != 0) {
        _.each(valid, function(s) {
          $('#square_' + s).addClass('target').droppable('enable');
        });
      }
    }
  };
  
  var mouseOverSquare = function(evt) {
    if (squareContainsPiece(evt)) {
      var square = $(evt.target).parent().attr('id').replace('square_', '');
      var validMoves = (game && game.getMoves(square)) || [];
      if (validMoves.length != 0) {
        $(evt.target).parent().addClass('highlight');
      }
    }
  };
  
  var mouseOutSquare = function(evt) {
    if (squareContainsPiece(evt)) {
        $(evt.target).parent().removeClass('highlight');
    }    
  };

  var squareContainsPiece = function(evt) {
    return evt.target.tagName.toLowerCase() == 'img';
  };
  
  return {
    init: function() {
      init();
      stateController.onStartGame(function(w, b) {
        game.start(w, b);
      });
      stateController.onCreateGame(function(fen) {
        game = new capa.Game(fen);
        game.onEvent(handleEvent);
        createPieces(fen);
      });
    },
    setStateController: function(obj) {
      stateController = obj;
    }
  }
  
};