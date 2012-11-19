Dialogs = require 'controllers/dialogs'
Games = require 'controllers/games'
Header = require 'controllers/header'
Loading = require 'controllers/loading'
Home = require 'controllers/home'
User = require 'models/user'


class App extends Spine.Stack
  controllers:
    home: Home
    dialogs: Dialogs
    games: Games
    
  constructor: ->
    super
    @log "Well, hello there."
    @user = new User()
    @user.setToken('testtoken')
    # @header = new Header()
    @loading = new Loading()

    # @dialogs.el.add(@header.el).add(@loading.el).hide()
    # @games = new Games()
    # @games.el.hide()
    # @home = new Home()
    # @home.el.hide()
    # @dialogs = new Dialogs()
    # @dialogs.el.hide()
    @append @loading

    Spine.Route.setup
      history: true
    
module.exports = App
