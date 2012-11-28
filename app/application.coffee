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
    # @route "/", => 
    #     @navigate("/home")

    @navigate("/home")
    @user = new User()
    @user.setToken('testtoken')
    @loading = new Loading()
    @append @loading
    @initConfig()

  initConfig: ->
    Spine.Model.host = 'http://v5.uspeakapp.com/'
    $ = @$
    $('a').live 'click', ->
        href = $(@).attr('href')
        Spine.Route.navigate href if href
        false
    $(".wide-screen").on "touchmove", (e)-> e.preventDefault()
    soundManager.setup
        url: '/swf/',
        preferFlash: false
    
module.exports = App
