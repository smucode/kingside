define ['jquery', 'backbone'], ($, Backbone) ->
  class Board extends Backbone.View

    el: '.board-view'

    img:
      r: 'br', n: 'bn', b: 'bb', q: 'bq', k: 'bk', p: 'bp'
      R: 'wr', N: 'wn', B: 'wb', Q: 'wq', K: 'wk', P: 'wp'

    initialize: (opts) ->
      opts.bus.on 'show_game', @updateBoard

    updateBoard: (game) =>
      for pos, piece of game._state.board
        # console.log ".#{pos}", @img[piece]
        @$el.find(".#{pos}").addClass @img[piece]      

    render: () ->
      files = 'abcdefgh'
      for rank in [8..1]
        $rank = $('<div class="rank"></div>').appendTo(@$el)
        for file in [0..7]
          san = files[file] + rank
          $file = $("<div class='file #{san}'></div>").appendTo $rank
          $file.addClass if (rank + file) % 2 == 0 then 'light' else 'dark'