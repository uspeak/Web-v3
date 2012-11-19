User = require 'models/user'

class Header extends Spine.Controller
  tag: 'header'
  elements:
    "#header-logged": "logged"
  attributes:
    id: 'main-header'
  constructor: ->
    super
    User.bind 'login', @showHeader
    @render()

  showHeader: =>
    @render()
    @logged.transition bottom:0

  render: ->
    @html require('views/header')(username:app?.user.username)


module.exports = Header
