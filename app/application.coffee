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
    @route "/", => 
        @navigate("/home")

    @navigate("/home")
    @user = new User()
    @user.setToken('testtoken')
    @loading = new Loading()
    @append @loading
    @initConfig()

  initConfig: ->
    Spine.Route.setup
      # history: false
      shim: true
    Spine.Model.host = 'http://v4.uspeakapp.com/'
    $ = @$
    $('a').live 'click', ->
        href = $(@).attr('href')
        Spine.Route.navigate href if href
        false
    # $(document).on "touchmove", (e)-> e.preventDefault()
    soundManager.setup
        url: '/swf/',
        preferFlash: false
    
module.exports = App
