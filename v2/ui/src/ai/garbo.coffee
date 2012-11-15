define ['underscore', '../../lib/garbochess.js'], (_, Engine) ->
  class Garbo
    constructor: (color) ->
      @color = color
      @engine = new Engine
      @name = 'the computer'
  
    search: (from, to, cb) ->
        @engine.move from, to
        _.defer => @engine.search cb