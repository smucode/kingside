define ['jquery', 'backbone'], ($, Backbone) ->
  class Board extends Backbone.View

    el: '.board-view'

    initialize: (opts) ->
      opts.bus.on 'show_game', (game) ->
        # do stuff

    render: () ->
      files = 'abcdefgh'
      for rankIdx in [8..1]
        rankEl = $('<div class="rank"></div>').appendTo(@$el)
        for fileIdx in [0..7]
          fileEl = $("<div class='file'>#{files[fileIdx]}#{rankIdx}</div>").appendTo(rankEl)
          fileEl.addClass if (rankIdx + fileIdx) % 2 == 0 then 'light' else 'dark'