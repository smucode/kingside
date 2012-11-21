define [
  'jquery'
  'backbone'
  'text!./game_controls.html'
], ($, Backbone, html) ->

  class GameControls extends Backbone.View

    el: '.game-controls'

    events:
      'click .resign': 'onResign'

    initialize: (opts) ->
      @bus = opts.bus
      opts.bus.on 'rex/move', @onMove

    render: ->
      @$el.append html

    onResign: (e) ->
      @bus.trigger 'resign'

    onMove: (board) =>
      console.log board._state.finished
      @$el.find('.resign').html (if board._state.finished then 'Restart' else 'Resign')
