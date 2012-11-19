define [
  'jquery'
  'backbone'
  'text!./game_controls.html'
], ($, Backbone, html) ->

  class Board extends Backbone.View

    el: '.game-controls'

    events:
      'click .resign': 'onResign'

    initialize: (opts) ->
      @bus = opts.bus

    render: ->
      @$el.append html

    onResign: (e) ->
      e.preventDefault()
      @bus.trigger 'resign'