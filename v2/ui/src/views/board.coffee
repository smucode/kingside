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
      
      @resetBoard() if @board
      @board = _.clone game._state.board
      
      for pos, piece of @board
        @$el.find(".file[data-san=#{pos}]").addClass @img[piece]

    resetBoard: ->
      for pos, piece of @board
        @$el.find(".file[data-san=#{pos}]").removeClass @img[piece]

    click: (e) =>
      san = $(e.target).attr('data-san')
      if @isSameAsSelected san then @unselectSelected()
      else if @isMovablePiece san then @updateSelectedPiece san
      else if @isValidTarget san then @moveSelectedPiece san

    isSameAsSelected: (san) ->
      @selected is san

    isMovablePiece: (san) ->
      @game._state.valid_moves[san]

    isValidTarget: (san) ->
      @selected and @game._state.valid_moves[@selected].indexOf(san) isnt -1

    updateSelectedPiece: (san) ->
      @unselectSelected()
      @selected = san
      @$el.find(".file[data-san=#{san}]").addClass 'selected'

    moveSelectedPiece: (san) ->
      @bus.trigger 'move', @selected, san
      @unselectSelected()

    unselectSelected: ->
      if @selected
        @$el.find(".file[data-san=#{@selected}]").removeClass 'selected'
        @selected = null