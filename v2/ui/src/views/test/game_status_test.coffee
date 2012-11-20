define ['jquery', 'cs!../game_status'], ($, View) ->

  buster.testCase 'GameStatus'

    'setUp': ->
      $('body').append('<div class="game-status"></div>')

      @bus =
        on: ->
        trigger: ->

      @view = new View
        bus: @bus

      @view.render()

    'renders': ->
      assert @view.$el.length, 1