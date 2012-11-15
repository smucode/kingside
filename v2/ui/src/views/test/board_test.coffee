define ['jquery', 'cs!../board'], ($, Board) ->
  buster.testCase 'Board'

    'setUp': ->
      $('body').append('<div class="board-view"></div>')
      @bus = 
        on: ->
        trigger: ->

      @board = new Board
        bus: @bus

      @board.render()

      @board.updateBoard
        _state: 
          board: a8: 'r', a1: 'r'
          valid_moves: 'a8': ['a7'], 'a1': []

    'creates empty board': ->
      assert.equals @board.$el.find('.rank').length, 8
      assert.equals @board.$el.find('.file').length, 64

    'renders initial board': ->
      assert.equals @board.$el.find('.file.br').length, 2

    'reset selected when same piece is clicked twice': ->
      el = @board.$el.find('.file[data-san=a8]')

      el.click()
      assert el.hasClass 'selected'
      assert.equals @board.selected, 'a8'
      
      el.click()
      refute el.hasClass 'selected'
      refute.equals @board.selected, 'a8'

    'selected piece is updated on click': ->
      el = @board.$el.find('.file[data-san=a8]')

      el.click()
      assert el.hasClass 'selected'
      assert.equals @board.selected, 'a8'
      
      el = @board.$el.find('.file[data-san=a1]')

      el.click()
      assert el.hasClass 'selected'
      assert.equals @board.selected, 'a1'
      
      assert.equals @board.$el.find('.selected').length, 1

    'clicking two pieces triggers move event': ->
      @bus.trigger = @spy()

      @board.$el.find('.file[data-san=a8]').click()
      @board.$el.find('.file[data-san=a7]').click()

      assert.calledOnce @bus.trigger
      assert.calledWith @bus.trigger, 'move', 'a8', 'a7'

      refute @board.selected

    'only pieces with valid moves can move': ->
      @board.$el.find('.file[data-san=b5]').click()
      refute @board.selected

    'pieces can only make valid moves': ->
      @bus.trigger = @spy()

      @board.$el.find('.file[data-san=a8]').click()
      @board.$el.find('.file[data-san=b2]').click()
      
      refute.calledOnce @bus.trigger

    'update board should remove previous state': ->
      assert @board.$el.find('.file[data-san=a8]').hasClass 'br'
      assert @board.$el.find('.file[data-san=a1]').hasClass 'br'

      @board.updateBoard _state: board: a7: 'r'

      refute @board.$el.find('.file[data-san=a8]').hasClass 'br'
      refute @board.$el.find('.file[data-san=a1]').hasClass 'br'
      assert @board.$el.find('.file[data-san=a7]').hasClass 'br'