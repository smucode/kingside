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

    'clicking a piece updates selected': ->
      @board.render()
      @board.updateBoard 
        _state: 
          board: a8: 'r'
          valid_moves: []

      @board.$el.find('.file[data-san=a8]').click()

      assert.equals @board.selected, 'a8'

    'clicking two pieces triggers move event': ->
      @board.render()
      @board.updateBoard 
        _state: 
          board: a8: 'r'
          valid_moves: ['a7']

      @bus.trigger = @spy()

      @board.$el.find('.file[data-san=a8]').click()
      @board.$el.find('.file[data-san=a7]').click()

      assert.calledOnce @bus.trigger
      assert.calledWith @bus.trigger, 'move', 'a8', 'a7'

