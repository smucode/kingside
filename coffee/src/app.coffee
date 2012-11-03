define [
  'jquery'
  'cs!./core/bus'
  'cs!./views/board'
], ($, Bus, Board) ->

  class Foo
    constructor: ->
      bus = new Bus

      for View in [Board]
        view = new View bus: bus
        view.render()