User = require 'models/user'

class Home extends Spine.Controller
  id: 'home'
  constructor: ->
    super
    @render()
    @routes
      '/home': @active
    User.bind 'login', => @active()

  render: ->
    @html require('views/home')()

  show: =>
    @el.show().css opacity:0
    @el.transition opacity:1

module.exports = Home
