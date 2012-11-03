vows = require 'vows'
assert = require 'assert'
foo = require '../foo'

vows
  .describe('Foo')
  .addBatch
    'creating foo':

      topic: -> new foo
      'it should exist': (topic) ->
        assert topic

  .export(module)