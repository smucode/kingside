define [
  'jquery'
  'backbone'
], ($, Backbone) ->

  class GameStatus extends Backbone.View

    el: '.game-status'

    initialize: (opts) ->
      opts.bus.on 'rex/move', @onMove

    render: ->
      @$el.html "It's your move..."

    onMove: (board) =>
      if board._state.finished is 'checkmate'
        msg = 'Checkmate!'
      else
        col = if board._state.active_color is 'w' then 'White' else 'Black'
        msg = "#{col} to move"
        msg += if board._state.check then '. Check!' else ''
      @$el.html msg