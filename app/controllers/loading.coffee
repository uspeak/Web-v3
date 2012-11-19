Resource = require 'models/resource'

class Loading extends Spine.Controller
  attributes:
    id: 'loading'
  constructor: ->
    super
    Spine.bind 'ajax:before', => @show()
    Spine.bind 'ajax:after', => @hide()
    # Spine.bind 'loading:hide', => @hide()
    @render()

  render: ->
  	@html require('views/loading')()

  show: ->
    @log 'Show loading'
    @el.show().css(opacity:0).transition(opacity:1)

  hide: ->
    @log 'Hide loading'
    @el.stop().transition(opacity:0, => @el.hide())

module.exports = Loading
