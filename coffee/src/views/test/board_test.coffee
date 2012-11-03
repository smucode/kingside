define ['jquery', 'cs!../board'], ($, Board) ->
  buster.testCase 'Board'
    'exists': ->
      assert Board
    'renders': ->
      board = new Board
      board.render $('<div></div>')
      assert true