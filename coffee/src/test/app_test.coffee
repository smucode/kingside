define ['cs!../app'], (App) ->
  buster.testCase 'App'
    'exists': ->
      app = new App
      assert app