define ['jquery', 'backbone'], ($, Backbone) ->
  class Board extends Backbone.View

    el: '.board-view'

    img:
      r: 'br', n: 'bn', b: 'bb', q: 'bq', k: 'bk', p: 'bp'
      R: 'wr', N: 'wn', B: 'wb', Q: 'wq', K: 'wk', P: 'wp'

    events:
      'click .file': 'click'

    initialize: (opts) ->
      @bus = opts.bus
      @bus.on 'show_game', @updateBoard

    render: () ->
      files = 'abcdefgh'
      for rank in [8..1]
        frag = '<div class="rank"></div>'
        $rank = $(frag).appendTo(@$el)
        for file in [0..7]
          san = files[file] + rank
          frag = "<div data-san='#{san}' class='file'></div>"
          $file = $(frag).appendTo $rank
          $file.addClass if (rank + file) % 2 == 0 then 'light' else 'dark'

    updateBoard: (game) =>
      @game = game
      for pos, piece of game._state.board
        @$el.find(".file[data-san=#{pos}]").addClass @img[piece]

    click: (e) =>
      san = $(e.target).attr('data-san')
      if @selected
        if @selected is san
          @unselectSelected()
        else
          @moveSelectedPiece san if @game._state.valid_moves[@selected].indexOf(san) isnt -1
      else
        @updateSelectedPiece san if @game._state.valid_moves[san]

    updateSelectedPiece: (san) ->
      @selected = san
      @$el.find(".file[data-san=#{san}]").addClass 'selected'

    moveSelectedPiece: (san) ->
      @bus.trigger 'move', @selected, san
      @unselectSelected()

    unselectSelected: ->
      @$el.find(".file[data-san=#{@selected}]").removeClass 'selected'
      @selected = null