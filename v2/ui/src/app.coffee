define [
  'jquery'
  'rex'
  'cs!./core/bus'
  'cs!./views/board'
  'cs!./views/game_controls'
  'cs!./ai/garbo'
], ($, rex, Bus, Board, GameControls, AI) ->

  class Foo
    constructor: ->
      bus = new Bus

      for View in [Board, GameControls]
        view = new View bus: bus
        view.render()

      ai = new AI 'b'

      board = new rex.Board
      bus.trigger 'show_game', board

      bus.on 'move', (from, to) ->
        board.move.apply board, arguments
        bus.trigger 'show_game', board
        ai.search from, to, ->
          board.move.apply board, arguments
          bus.trigger 'show_game', board

      bus.on 'resign', ->
        ai = new AI 'b'

        board = new rex.Board
        bus.trigger 'show_game', board
