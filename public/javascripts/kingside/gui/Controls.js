jsx.declare('kingside.gui');

kingside.gui.Controls = function() {

  var FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  var stateController;

  var init = function(html) {
    $('body').append(html);
    $('.cc').click(function() {
      stateController.startGame('c', 'c');
    }).focus();
    $('.hc').click(function() {
      stateController.startGame('h', 'c');
    });
    $('.hh').click(function() {
      stateController.startGame('h', 'h');
    });
    $('.fen').val(FEN).change(function() {
      stateController.createGame($(this).val());
    });
    window.setTimeout(function() {
      stateController.createGame(FEN);
    }, 100);
  };
  
  return {
    init: function() {
      $.get('views/controls.html', init);
    },
    setStateController: function(obj) {
      stateController = obj;
    }
  }
  
};