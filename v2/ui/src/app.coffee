define [
  'jquery'
  'rex'
  'cs!./core/bus'
  'cs!./views/board'
], ($, rex, Bus, Board) ->

  class Foo
    constructor: ->
      bus = new Bus

      for View in [Board]
        view = new View bus: bus
        view.render()

      board = new rex.Board
      bus.trigger 'show_game', board