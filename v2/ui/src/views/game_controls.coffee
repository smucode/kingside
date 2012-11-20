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

    render: ->
      @$el.append html

    onResign: (e) ->
      @bus.trigger 'resign'