define ['jquery', 'cs!../board'], ($, Board) ->
  buster.testCase 'Board'

    'setUp': ->
      $('body').append('<div class="board-view"></div>')
      @bus = 
        on: ->

      @board = new Board
        bus: @bus

    'creates empty board': ->
      @board.render()

      assert.equals @board.$el.find('.rank').length, 8
      assert.equals @board.$el.find('.file').length, 64

    'renders initial board': ->
      @board.render()
      @board.updateBoard
        _state: board: 
          a8: 'r', a1: 'r'

      assert.equals @board.$el.find('.file.br').length, 2
