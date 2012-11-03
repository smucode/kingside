define ['cs!../bus'], (Bus) ->
  buster.testCase 'Bus'
    'possible to pub and sub': (done) ->
      bus = new Bus
      assert bus
      bus.on 'foo', done
      bus.trigger 'foo'