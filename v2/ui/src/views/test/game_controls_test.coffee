define ['jquery', 'cs!../game_controls'], ($, View) ->

  buster.testCase 'GameControls'

    'setUp': ->
      $('body').append('<div class="game-controls"></div>')

      @bus = 
        on: ->
        trigger: ->

      @view = new View
        bus: @bus

      @view.render()

    'renders': ->
      assert @view.$el.find('a').length, 1

    'triggers resign event': ->
      @bus.trigger = @spy()

      @view.$el.find('.resign').click()

      assert @bus.trigger.calledWith 'resign'