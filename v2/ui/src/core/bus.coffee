define ['underscore', 'backbone'], (_, Backbone) ->
  class Bus
    constructor: ->
      _.extend @, Backbone.Events